
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>

// Set these to run example.
#define FIREBASE_HOST "hackverse-5ecdd-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "AEbliYsR55MsSboA0KqE7qattgvgE6JxzUmH2tDf"
#define WIFI_SSID "POCO M2 Pro"
#define WIFI_PASSWORD "12345678"
#define FLAME_SENSOR_PIN D2
void setup() {
  Serial.begin(9600);
  pinMode(FLAME_SENSOR_PIN, INPUT); 

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
int pinValue = 1;

int n = 0;

void loop() {

if (digitalRead(FLAME_SENSOR_PIN) == 0) { // Check if flame sensor detects fire
    Firebase.setInt("fire", 1);

  delay(1000);
}
else{
    Firebase.setInt("fire", 0);
  delay(1000);

}
  delay(1000);

}