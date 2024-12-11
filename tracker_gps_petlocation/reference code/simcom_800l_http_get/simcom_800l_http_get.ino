#include <SoftwareSerial.h>
SoftwareSerial gprsShield(3, 2); //SIM800L Tx & Rx is connected to Arduino #3 & #2

void setup() {
  int baudRate=9600; // change the baud rate for your GSM modem eg: 9600, 115200
  Serial.begin(baudRate); // Serial monitor
  gprsShield.begin(baudRate); // gprsShield module
  delay(1000);
  String apn = "internet.globe.com.ph"; // Change this to the desired APN of cell provider
  String url = "https://jh-github-profiler.vercel.app/test/"; // Change this to the desired URL

  //sendGetRequestWithParameters(apn, url);  
  sendGetRequest();
  // Add any additional code here if needed
}

void loop() {
  // Add your main program logic here if needed
}

/**
 * The sequence of commands establishes the GPRS connection for performing an HTTP GET request
 * @param apn The Access Point Name for the SIM card's cellular network.
 * @param url The URL of the server you want to reach.
 */
void sendGetRequestWithParameters(const String& apn, const String& url) {
  sendCommand("AT"); //expected value OK
  sendCommand("AT+CIPSHUT"); //expected value OK
  sendCommand("AT+SAPBR=0,1"); //expected value OK
  sendCommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\""); // open GPRS context establish GPRS connection
  
  // Change the APN value for the SIM card based on the provided parameter
  String sapbr_apn_command = "AT+SAPBR=3,1,\"APN\",\"" + apn + "\"";
  sendCommand(sapbr_apn_command.c_str());
  
  sendCommand("AT+SAPBR=1,1"); // open GPRS context bearer
  sendCommand("AT+HTTPINIT"); // initiate HTTP request
  sendCommand("AT+HTTPPARA=\"CID\",1"); // set parameters for http session
  
  // Change the URL to the provided parameter
  String http_url_command = "AT+HTTPPARA=\"URL\",\"" + url + "\"";
  sendCommand(http_url_command.c_str());
  
  sendCommand("AT+HTTPACTION=0"); // send http request to specified URL, GET session start
  delay(1000); // wait for response for 9 seconds, reduce or increase based on your need
  sendCommand("AT+HTTPREAD"); // read results of request, normally contains status code 200 if successful
  sendCommand("AT+HTTPTERM"); // close http connection
  sendCommand("AT+CIPSHUT"); // close or turn off network connection
  sendCommand("AT+SAPBR=0,1"); // close GPRS context bearer
}

/**
 * The sequence of commands establishes the GPRS connection for performing an HTTP request
*/
void sendGetRequest(){

  sendCommand("AT"); //expected value OK
  sendCommand("AT+CIPSHUT"); //expected value OK
  sendCommand("AT+SAPBR=0,1"); //expected value OK
  sendCommand("AT+SAPBR=3,1,\"Contype\",\"GPRS\"");// open GPRS context establish GPRS connection
  sendCommand("AT+SAPBR=3,1,\"APN\",\"internet.globe.ph\"");//change this apn value for the SIM card
  sendCommand("AT+SAPBR=1,1");//open GPRS context bearer
  sendCommand("AT+SAPBR=2,1");//open GPRS context bearer
  sendCommand("AT+HTTPINIT");//initiate HTTP request 
  sendCommand("AT+HTTPPARA=\"CID\",1");//set parameters for http session
  sendCommand("AT+HTTPPARA=\"URL\",\"jh-github-profiler.vercel.app\""); //Change the URL from google.com to the server you want to reach
  sendCommand("AT+HTTPACTION=0");//send http request to specified URL, GET session start
  sendCommand("AT+HTTPACTION=0");//send http request to specified URL, GET session start
  delay(9000); //wait for response for 9 seconds, reduce or increase based on your need
  sendCommand("AT+HTTPREAD");// read results of request, normally contains status code 200 if successful
  sendCommand("AT+HTTPTERM");//close http connection
  sendCommand("AT+CIPSHUT");//close or turn off network connection
  sendCommand("AT+SAPBR=0,1");// close GPRS context bearer
  

}

void sendCommand(const char* command) {
  gprsShield.println(command);
  // delay(1000); //uncomment this delay if you need to wait a while
  ShowSerialData();
}
/**
 * Prints the serial data, and waits 1 second
 * */
void ShowSerialData() {
  Serial.println("Show serial data:");
  while (gprsShield.available()) {
    char c = gprsShield.read();
    Serial.write(c);
  }
  Serial.println("");
  delay(1000);
}