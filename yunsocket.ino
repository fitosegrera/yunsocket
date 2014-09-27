#include <dht.h>
#define dht_dpin A0 
int outputPin = 13;

dht DHT;

void setup()
{
  pinMode(outputPin, OUTPUT);
  Serial1.begin(9600);
  delay(700);//Wait rest of 1000ms recommended delay before
  //accessing sensor
}

void loop()
{

  //Sensor - Humidity and Temp
  DHT.read11(dht_dpin);
  
  Serial1.print('B');
  Serial1.print("Current humidity = ");
  Serial1.print(DHT.humidity);
  Serial1.print("%  ");
  Serial1.print("temperature = ");
  Serial1.print(DHT.temperature); 
  Serial1.print("C  ");
  Serial1.print('E');

  delay(1000);

  // arduino reads Serial
  if (Serial1.available() > 0) {
    int incomingByte = Serial1.read();

    if (incomingByte == 1) { // 0x01 = char 1
      digitalWrite(outputPin, HIGH);
    } else if (incomingByte == 0) { // 0x00 = char 0
      digitalWrite(outputPin, LOW);
    }
  }
}
