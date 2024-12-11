#include <SoftwareSerial.h>

// Setup software serial for sim800l
SoftwareSerial sim800l(3,2); // TX pin (3) and RX pin (2)
bool serialUpdating = false;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600); // Begin the serial communication with arduino and IDE (Serial Monitor)

  sim800l.begin(9600); // Begin the serial communication with arduino and sim800L

  Serial.println("Booting Sim800L..."); 
  delay(15000);
  
  Serial.println("Initializing SMS Reciever"); 
  delay(5000);
  initializeSmsRecieved();
}

void loop() {
  // put your main code here, to run repeatedly:
  if(!serialUpdating)
    updateSerial();
}

void initializeSmsRecieved(){
  serialUpdating = true;
  sim800l.println("AT"); //Once the handshake test is successful, it will back to OK
  updateSerial();
  sim800l.println("AT+CMGF=1"); // Configuring TEXT mode
  updateSerial();
  sim800l.println("AT+CNMI=2,2,0,0,0"); // Decides how newly arrived SMS messages should be handled
  serialUpdating = false;
}

void sendSms(String to, String msg){
  serialUpdating = true;
  sim800l.println("AT"); //Once the handshake test is successful, it will back to OK
  updateSerial();
  sim800l.println("AT+CMGF=1"); // Configuring TEXT mode
  updateSerial();
  sim800l.println("AT+CMGS=" + to);//change ZZ with country code and xxxxxxxxxxx with phone number to sms
  updateSerial();
  sim800l.print(msg); //text content
  updateSerial();
  sim800l.write(26);
  updateSerial();
  serialUpdating = false;
}

void updateSerial(){
  delay(500);
  while(Serial.available()){
    // forward what the serial recieved to sim800L
    sim800l.write(Serial.read());
  }

  String contents = "";
  while(sim800l.available()){
    // forward what sim800l recieved to the serial port
    char chars = sim800l.read();
    contents.concat(chars);
    
    Serial.write(chars);
  }

  if(contents != "" && contents.indexOf("+CMT:") > 0){
    /*
      Example recieved sms
      +CMT: "+63xxxxxxxxxx","","24/12/11,21:17:34+32"
      Wow
    */
    String str1 = getValue(contents, ',', 0); // +CMT: "+63xxxxxxxxxx"
    String str2 = getValue(contents, ',', 1); // ""
    String str3 = getValue(contents, ',', 2); // "24/12/11
    String str4 = getValue(contents, '\n', 2); // Wow

    String mobileNo = getValue(str1, ' ', 1); // "+63xxxxxxxxxx"

    Serial.println("\nMobile #: " + mobileNo);
    Serial.println("Message: " + str4);

    if(contents.indexOf("UPDATE") > 0)
      sendSms(mobileNo, "Updated location: location x y z");
    else sendSms(mobileNo, "Invalid Command :/");
  }
}

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}
