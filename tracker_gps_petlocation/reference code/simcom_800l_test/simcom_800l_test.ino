#include <SoftwareSerial.h>

//Create software serial object to communicate with SIM800L
SoftwareSerial mySerial(3, 2); //SIM800L Tx & Rx is connected to Arduino #3 & #2

void setup()
{
  //Begin serial communication with Arduino and Arduino IDE (Serial Monitor)
  Serial.begin(9600);
  
  //Begin serial communication with Arduino and SIM800L
  mySerial.begin(9600);

  Serial.println("Booting Sim800L..."); 
  delay(15000);
  
  Serial.println("Initializing"); 
  delay(5000);

  Serial.println("Handshake:\n===================="); 
  mySerial.println("AT"); //Once the handshake test is successful, it will back to OK
  updateSerial();

  Serial.println("\nChecking power"); 
  mySerial.println("AT+CBC"); // Checking power
  updateSerial();

  Serial.println("\nChecking registered sim network"); 
  mySerial.println("AT+CREG?"); //Check whether it has registered in the network
  updateSerial();


  Serial.println("\nChecking signal strength"); 
  mySerial.println("AT+CSQ"); //Signal quality test, value range is 0-31 , 31 is the best
  updateSerial();


  Serial.println("\nChecking connected network"); 
  mySerial.println("AT+COPS?"); //Signal quality test, value range is 0-31 , 31 is the best
  updateSerial();

  delay(1000);

  Serial.println("\nEXECUTING SMS:\n====================\n"); 
  delay(1000);

  mySerial.println("AT"); //Once the handshake test is successful, it will back to OK
  updateSerial();

  mySerial.println("AT+CMGF=1"); // Configuring TEXT mode
  updateSerial();
  mySerial.println("AT+CMGS=\"+ZZXXXXXXXXXX\"");//change ZZ with country code and xxxxxxxxxxx with phone number to sms
  updateSerial();
  mySerial.print("Hello boi"); //text content
  updateSerial();
  mySerial.write(26);
  // mySerial.println("AT+CNMI=1,2,0,0,0"); // Decides how newly arrived SMS messages should be handled
  // updateSerial();

  updateSerial();
  
  Serial.println("\nMessage Sent"); 
  updateSerial();
}

void loop()
{
}

void updateSerial()
{
  delay(500);
  while (Serial.available()) 
  {
    mySerial.write(Serial.read());//Forward what Serial received to Software Serial Port
  }
  while(mySerial.available()) 
  {
    Serial.write(mySerial.read());//Forward what Software Serial received to Serial Port
  }
}