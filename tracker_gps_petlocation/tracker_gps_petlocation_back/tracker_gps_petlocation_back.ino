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
  delay(5000);
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

void loadGPSData(){
  //Serial.println("\nTransmitting/Receiving GPS Data");
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

    gps_location_data = "lat: ";
    gps_location_data.concat(flat);
    gps_location_data.concat(" , lon: ");
    gps_location_data.concat(flon);
    
    message_transport = "pinName=" + arduino_id + "&lat=";
    message_transport.concat(flat);
    message_transport.concat("&long=");
    message_transport.concat(flon);

    Serial.println("\nLocation Updated");
  }else{
    gps_location_data = "{location data was not fetched, GPS Module might have no signal}";
    message_transport = "pinName=" + arduino_id + "&lat=0.000&long=0.000";
    
    Serial.println("\nSatellite Not Available");
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

  
  //Serial.println("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n");
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
    Serial.println("\Date : " + str3);
    Serial.println("COMMAND: " + str4);

    int command = 0;
    if(contents.indexOf("UPDATE") >= 0)
      command = 1;
    else if(contents.indexOf("LOCATE") >= 0)
      command = 2;
    else if(contents.indexOf("TAG") >= 0)
      command = 3;
    else if(contents.indexOf("ALERT-ON") >= 0)
      command = 4;
    else if(contents.indexOf("ALERT-OFF") >= 0)
      command = 5;
    else if(contents.indexOf("STATUS") >= 0)
      command = 6;
    else if(contents.indexOf("HELP") >= 0)
      command = 7;

    switch(command) {
      case 1:
        Serial.println("Executing UPDATE");
        sendSms(mobileNo, "The updated GPS Location of arduino id (" + String(arduino_id) + "): " + gps_location_data);
        break;
      case 2:
        Serial.println("Executing LOCATE");
        sendSms(mobileNo, "To locate your pet copy the code below and paste in our website: \n\n" + message_transport);
        break;
      case 3:
        Serial.println("Executing TAG");
        sendSms(mobileNo, message_transport);
        break;
      case 4:
        Serial.println("Executing ALERT-ON");
        digitalWrite(ALERT_PIN, HIGH); // Turn On LED
        sendSms(mobileNo, "ALERT MODE WAS TURNED ON\n\nType: ALERT-OFF to turn it off.");
        break;
      case 5:
        Serial.println("Executing ALERT-OFF");
        digitalWrite(ALERT_PIN, LOW); // Turn Off LED
        sendSms(mobileNo, "ALERT MODE WAS TURNED OFF\n\nType: ALERT-ON to turn it on.");
        break;
      case 6: {
        Serial.println("Executing STATUS");
        String msg = "Device Information:\n\nArduino id: (" + String(arduino_id) + ")\nSIM800L enabled: " 
                    + (sim_enabled ? "yes" : "no") + "\nNEOGPS enabled: " 
                    + (gps_enabled ? "yes" : "no") + "\nLocation Data: " + gps_location_data;
        sendSms(mobileNo, msg);
        Serial.println(msg);
        Serial.println(gps_location_data);
        break;
      }
      case 7:
        Serial.println("Executing HELP");
        sendSms(mobileNo, "LIST OF COMMANDS:\nSTATUS : get device status\nLOCATE : get the gps location of the pet\nTAG : get the tag gps location for website use\nUPDATE : get the updated gps location of the pet\nALERT-ON : turn on alert mode\nALERT-OFF : turn off alert mode");
        Serial.println("LIST OF COMMANDS:\nSTATUS : get device status\nLOCATE : get the gps location of the pet\nTAG : get the tag gps location for website use\nUPDATE : get the updated gps location of the pet\nALERT-ON : turn on alert mode\nALERT-OFF : turn off alert mode");
        break;
      case 0:
        Serial.println("Executing DEFAULT");
        sendSms(mobileNo, "You have entered an invalid command\nType HELP for help");
        break;
      default:
        Serial.println("Executing DEFAULT");
        sendSms(mobileNo, "You have entered an invalid command\nType HELP for help");
    }

    Serial.println("Command Executed...");
 
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
