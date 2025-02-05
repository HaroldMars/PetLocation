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
String message_transport;

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
  bool newData = false;
  unsigned long chars;
  unsigned short sentences, failed;

  // For one second we parse GPS data and report some key values
  for (unsigned long start = millis(); millis() - start < 1000;)
  {
    while (neoGPS.available())
    {
      char c = neoGPS.read();
      if (gps.encode(c)) // Did a new valid sentence come in?
        newData = true;
    }
  }
  if (newData)
  {
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);

    char latBuffer[15], lonBuffer[15];
    dtostrf(flat, 12, 6, latBuffer); // Convert float to string with 6 decimal places
    dtostrf(flon, 12, 6, lonBuffer);

    String latStr = String(latBuffer);
    latStr.trim(); // Remove leading/trailing spaces

    String lonStr = String(lonBuffer);
    lonStr.trim(); // Remove leading/trailing spaces

    gps_location_data = "latitude=" + latStr + " longitude=" + lonStr;
    message_transport = "pinName=" + arduino_id + "&lat=" + latStr + "&long=" + lonStr;


    //Serial.println("\nLocation Updated: " + gps_location_data);
  }else{
    gps_location_data = "location data was not fetched. GPS Module might have no signal";
    message_transport = "pinName=" + arduino_id + "&lat=0.000&long=0.000";
    
    Serial.println("\nSatellite Not Available");
    Serial.println(gps_location_data);
  }
  
  gps.stats(&chars, &sentences, &failed);
  if (chars == 0)
    Serial.println("** No characters received from GPS: check wiring **");

}

void initializeSmsReceiver()
{
  sim800l.println("AT");
  updateSerial();
  sim800l.println("AT+CMGF=1");
  updateSerial();
  sim800l.println("AT+CNMI=2,2,0,0,0"); 
  updateSerial();
  sim_enabled = true;
}

void sendSms(String to, String msg)
{
  sim800l.listen();
  sim800l.println("AT"); 
  updateSerial();
  sim800l.println("AT+CMGF=1");
  updateSerial();
  sim800l.println("AT+CMGS=" + to);
  updateSerial();
  sim800l.print(msg);
  updateSerial();
  sim800l.write(26);
  updateSerial();
}

void updateSerial()
{
  delay(200);
  while (Serial.available())
  {
    sim800l.write(Serial.read());
  }

  String contents = "";
  while (sim800l.available())
  {
    char chars = sim800l.read();
    contents.concat(chars);

    Serial.write(chars);
  }

  if (contents != "" && contents.indexOf("+CMT:") > 0)
  {
    String str1 = getValue(contents, ',', 0);  // +CMT: "+63xxxxxxxxxx"
    String str2 = getValue(contents, ',', 1);  // ""
    String str3 = getValue(contents, ',', 2);  // "24/12/11
    String str4 = getValue(contents, '\n', 2); // Wow

    String mobileNo = getValue(str1, ' ', 1); // "+63xxxxxxxxxx"
    Serial.println("\nMobile #: " + mobileNo);

    bool valid_command = false;

    if(contents.indexOf("UPDATE") > 0){
      Serial.println("Executing UPDATE command");
      sendSms(mobileNo, gps_location_data);
      valid_command = true;
    }
    if(contents.indexOf("TAG") > 0 || contents.indexOf("LOCATE") > 0){
      Serial.println("Executing TAG command");
      sendSms(mobileNo, message_transport);
      valid_command = true;
    }
    if(contents.indexOf("ALERT-ON") > 0){
      Serial.println("Executing ALERT-ON command");
      digitalWrite(ALERT_PIN, HIGH); // Turn On LED
      sendSms(mobileNo, "ALERT MODE WAS TURNED ON");
      valid_command = true;
    }
    if(contents.indexOf("ALERT-OFF") > 0){
      Serial.println("Executing ALERT-OFF command");
      digitalWrite(ALERT_PIN, LOW); // Turn Off LED
      sendSms(mobileNo, "ALERT MODE WAS TURNED OFF");
      valid_command = true;
    }
    if(contents.indexOf("STATUS") > 0){
      Serial.println("Executing STATUS command");
      String msg = "Device Information: ";
      msg.concat("\nSIM800L enabled: ");
      msg.concat(sim_enabled ? "yes" : "no");
      msg.concat("\nNEOGPS enabled: ");
      msg.concat(gps_enabled ? "yes" : "no");
      // msg.concat("\nLocation Data: ");
      // msg.concat(gps_location_data);
      sendSms(mobileNo, msg);
      valid_command = true;
    }
    if(contents.indexOf("HELP") > 0){
      Serial.println("Executing HELP command");
      sendSms(mobileNo, "Commands:\n-UPDATE\n-TAG\n-ALERT-ON\n-ALERT-OFF\n-STATUS");
      valid_command = true;
    }

    if(!valid_command){
      Serial.println("Executing DEFAULT command");
      sendSms(mobileNo, "You have entered an invalid command\nType HELP for help");
    }
 
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
