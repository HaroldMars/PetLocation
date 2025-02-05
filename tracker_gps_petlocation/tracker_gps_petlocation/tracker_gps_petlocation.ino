#include <NeoSWSerial.h>
#include <TimerOne.h>

#include <TinyGPS.h>

// Setup software serial for sim800l
NeoSWSerial sim800l(3, 6); // TX pin (3) and RX pin (6)
bool serialUpdating = false;
int run_loop = 0;
bool sim_enabled = false;

TinyGPS gps;
NeoSWSerial neoGPS(7, 2); // TX pin (7) and RX pin (2)
String gps_location_data = "Not retrieved yet...";
bool gps_enabled = false;

// LED Light
int ALERT_PIN = 8;

String arduino_id = "pet_tag_1";
String message_transport = "[empty]";

void setup()
{
  // put your setup code here, to run once:
  delay(3000);
  Serial.println("Booting Serial Connection...");
  Serial.begin(9600); // Begin the serial communication with arduino and IDE (Serial Monitor)
  Serial.println("Booting Sim800L...");
  sim800l.begin(9600); // Begin the serial communication with arduino and sim800L
  Serial.println("Booting NeoGPS...");
  Serial.println(TinyGPS::library_version());
  neoGPS.begin(9600); // Begin the serial communication  with arduino and neoGPS

  neoGPS.listen();
  loadGPSData();

  Serial.println("Initializing SMS Receiver");
  delay(2000);

  sim800l.listen();
  initializeSmsReceiver();

  delay(1000);
  Serial.println("Device is now running\n");

  pinMode(ALERT_PIN, OUTPUT); // ALERT LED PIN 8
}

void loop()
{
  sim800l.listen();
  updateSerial();

  if (run_loop++ >= 100)
  {
    delay(20);
    neoGPS.listen();
    loadGPSData();
    run_loop = 0;
    delay(20);
    sim800l.listen();
  }
}

void loadGPSData()
{
  // Serial.println("\nTransmitting/Receiving GPS Data");
  bool newData = false;
  unsigned long chars;
  unsigned short sentences, failed;

  // For one second we parse GPS data and report some key values
  for (unsigned long start = millis(); millis() - start < 1000;)
  {
    while (neoGPS.available())
    {
      char c = neoGPS.read();
      // Serial.write(c); // uncomment this line if you want to see the GPS data flowing
      if (gps.encode(c)) // Did a new valid sentence come in?
        newData = true;
    }
  }
  if (newData)
  {
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);
    Serial.print("LAT=");
    Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6);
    Serial.print(" LON=");
    Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6);
    Serial.print(" SAT=");
    Serial.print(gps.satellites() == TinyGPS::GPS_INVALID_SATELLITES ? 0 : gps.satellites());
    Serial.print(" PREC=");
    Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());

    char latBuffer[10], lonBuffer[10];
    dtostrf(flat, 8, 6, latBuffer); // Convert float to string with 6 decimal places
    dtostrf(flon, 8, 6, lonBuffer);

    gps_location_data = "lat: ";
    gps_location_data.concat(latBuffer);
    gps_location_data.concat(" , lon: ");
    gps_location_data.concat(lonBuffer);

    message_transport = "pinName=" + arduino_id + "&lat=";
    message_transport.concat(latBuffer);
    message_transport.concat("&long=");
    message_transport.concat(lonBuffer);

    Serial.println("\nLocation Updated");
    gps_enabled = true;
  }
  else
  {
    gps_location_data = "{location data was not fetched, GPS Module might have no signal}";
    message_transport = "pinName=" + arduino_id + "&lat=0.000&long=0.000";

    Serial.println("\nSatellite Not Available");
    gps_enabled = false;
  }

  gps.stats(&chars, &sentences, &failed);
  // Serial.print(" CHARS=");
  // Serial.print(chars);
  // Serial.print(" SENTENCES=");
  // Serial.print(sentences);
  // Serial.print(" CSUM ERR=");
  // Serial.println(failed);
  if (chars == 0)
    Serial.println("** No characters received from GPS: check wiring **");

  // Serial.println("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
}

void initializeSmsReceiver()
{
  sim800l.println("AT"); // Once the handshake test is successful, it will back to OK
  updateSerial();
  sim800l.println("AT+CMGF=1"); // Configuring TEXT mode
  updateSerial();
  sim800l.println("AT+CNMI=2,2,0,0,0"); // Decides how newly arrived SMS messages should be handled
  updateSerial();
  sim_enabled = true;
}

void sendSms(String to, String msg)
{
  sim800l.println("AT"); // Once the handshake test is successful, it will back to OK
  updateSerial();
  sim800l.println("AT+CMGF=1"); // Configuring TEXT mode
  updateSerial();
  sim800l.println("AT+CMGS=" + to); // change ZZ with country code and xxxxxxxxxxx with phone number to sms
  updateSerial();
  sim800l.print(msg); // text content
  updateSerial();
  sim800l.write(26);
  updateSerial();
}

void updateSerial()
{
  delay(500);
  while (Serial.available())
  {
    // forward what the serial recieved to sim800L
    sim800l.write(Serial.read());
  }

  String contents = "";
  while (sim800l.available())
  {
    // forward what sim800l recieved to the serial port
    char chars = sim800l.read();
    contents.concat(chars);

    Serial.write(chars);
  }

  if (contents != "" && contents.indexOf("+CMT:") > 0)
  {
    /*
      Example recieved sms
      +CMT: "+63xxxxxxxxxx","","24/12/11,21:17:34+32"
      Wow
    */
    String str1 = getValue(contents, ',', 0);  // +CMT: "+63xxxxxxxxxx"
    String str2 = getValue(contents, ',', 1);  // ""
    String str3 = getValue(contents, ',', 2);  // "24/12/11
    String str4 = getValue(contents, '\n', 2); // Wow

    String mobileNo = getValue(str1, ' ', 1); // "+63xxxxxxxxxx"

    Serial.println("\nMobile #: " + mobileNo);
    Serial.println("Message: " + str4);

    if (contents.indexOf("UPDATE") > 0)
      sendSms(mobileNo, "The updated GPS Location of arduino id (" + arduino_id + "): " + gps_location_data);
    if (contents.indexOf("LOCATE") > 0)
    {
      sendSms(mobileNo, "To locate your pet copy the code below and paste in our website: \n\n" + message_transport);
    }
    if (contents.indexOf("TAG") > 0)
    {
      sendSms(mobileNo, message_transport);
    }
    if (contents.indexOf("ALERT-ON") > 0)
    {
      digitalWrite(ALERT_PIN, HIGH); // Turn On LED
      sendSms(mobileNo, "ALERT MODE WAS TURNED ON\n\nType: ALERT-OFF to turn it off.");
    }
    if (contents.indexOf("ALERT-OFF") > 0)
    {
      digitalWrite(ALERT_PIN, LOW); // Turn Off LED
      sendSms(mobileNo, "ALERT MODE WAS TURNED OFF\n\nType: ALERT-ON to turn it on.");
    }

    if (contents.indexOf("STATUS") > 0)
    {
      sendSms(mobileNo, "Device Information:\nArduinoId:" + arduino_id + "\nSIM800L: " + sim_enabled + "\nNEOGPS: " + gps_enabled + "\nLoaded Location: " + gps_location_data);
    }
    else
      sendSms(mobileNo, "Invalid Command :/");
  }
}

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length() - 1;

  for (int i = 0; i <= maxIndex && found <= index; i++)
  {
    if (data.charAt(i) == separator || i == maxIndex)
    {
      found++;
      strIndex[0] = strIndex[1] + 1;
      strIndex[1] = (i == maxIndex) ? i + 1 : i;
    }
  }

  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}
