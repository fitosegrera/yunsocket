yunsocket
=========
This project uses nodejs, serialport and socket.io to create a webserver on the arduino Yun and have full controll of the arduino chip through an online interface. For this example I use a [DHT11Temp/Hum Sensor](http://www.hobbyist.co.nz/?q=documentations/wiring-up-dht11-temp-humidity-sensor-to-your-arduino) connected to Analog 0 and a regular LED on pin 13. 


####Dependencies
Before starting there are some things we need to do:

__Exanding the Yun's disk space using a microSD card and an arduino sketch:__

There is a very clear tutorial on how to do this at: [tutorial](http://arduino.cc/en/Tutorial/ExpandingYunDiskSpace). After uploading the "yunDiskSpaceExpander.ino" to the Yun and opening the serial terminal from the arduino IDE (as mentioned in the tutorial) you might get the message:

	Unable to connect: retrying (1)... 
	Unable to connect: retrying (2)... 
	Unable to connect: retrying (3)... 
	Unable to connect: retrying (4)... 
	Unable to connect: is the sketch using the bridge? 

To fix this you should plug your arduino Yun directly to your computer (via usb) and sellect the apropiate port from the arduino tools menu (Do not use the wifi option yourYunName at ip etc etc... Please use the usb serial) After seting up the port correctly, then upload the sketch, reopen the serial terminal and follow the instructions.

__Installing nodejs on the Yun:__

After successfully exanding your Yun's disk space you are now ready to install nodejs. 

1.ssh into your yun through the terminal:

	ssh root@yourYunName.local

It will prompt for your Yun's password.

2.After connected to the board via ssh update the yun:

	opkg update

3.Install nodejs:

	opkg install node

You should now have node up and running. Test it by typing:

	node

__Arduino Libraries:__

We will be using the DHT library for the sensor. You can download the library from [LINK](https://github.com/adafruit/DHT-sensor-library)

####Create a NODEJS server on the Yun

By default, after expanding the Yun's disk space, a new folder is created and shared public as static content The path is:

	/mnt/sda1/arduino/www

We will create a new folder for our server at the same level of the "www" folder (NOT inside the "www" folder)

1.ssh into the yun:

	ssh root@yourYunName.local

2.Go to the root folder:

	cd ..

3.Go to the arduino folder and create a new folder for your nodejs serve:

	cd mnt/sda1/arduino

	mkdir yunsocket

For some reason nano (the linux terminal text editor) does not work for me inside this new folder. So I decided to write the scripts on my local machine and then transfer them to the Yun.

	The nodejs script is called server.js and is part of the repository...

Save the script with any name you want, I called mine "server.js". 

4.Before transfering the files to the arduino Yun, we need to make sure that everything is modified to fit our network needs. So open the "index.html" file and lets modify some stuff:

4.1.Line 11 looks like:

	<script src="http://yunshaman.local:9001/socket.io/socket.io.js"></script>

Modify "src", replacing "yunshaman" for your Yun's name.

4.2.Line 13 looks like:

	var socket = io.connect('http://yunshaman.local:9001');

Replace "yunshaman" for your Yun's name.

5.Now, to transfer the nodejs script to the Yun we will use the terminal command "scp" (You can also use a ftp manager like FILEZILA or cyberduck). This process was done using ubuntu 13.10 but it should work perfectly fine with any version of Mac OSX. From a new terminal window type:

	scp server.js root@yourYunName.local:/mnt/sda1/arduino/yunsocket/

NOTE: Make sure that, in your terminal, you are at the same level as your server.js file.

6.You will also need the "index.html" file to be at the same level of the "server.js" file on your Yun. This html file has the GUI that will be used to interface with the arduino Yun. 

	The html file is called index.html and is part of the repository...

Use the same metthod to transfer the html file to the arduino:

	scp index.html root@yourYunName.local:/mnt/sda1/arduino/yunsocket/

Now if you check your your "yunsocket" folder in your Yun, you should see the files transfered.

####Install node-serialport & socket.io
In order to use the serial port from nodejs we will need to install a special package for the yun. So SSH into the Yun if your are not in it already. Then type and hit enter for the following commands, one after the other:

	opkg update

	opkg install node-serialport

The same for socket.io:

	opkg update

	opkg install node-socket.io


####Disable the Bridge Script on the Yun
Disable the Yun's bridge to take control of the serialport interface. Yo can ENABLE it later if you want by undoing the process.

1.SSH into the Yun (if you are not already in):

	ssh root@yourYunName.local

2.Now we need to edit the "/etc/inittab" file and comment the ttyATH0 line by putting a # before it, we will use the terminal text editor "nano":

	nano /etc/inittab

After editing your inittab file should look like:

	::sysinit:/etc/init.d/rcS S boot
	::shutdown:/etc/init.d/rcS K shutdown
	#ttyATH0::askfirst:/bin/ash --login

####Running
From your arduino Yun's terminal, cd into the directory of the project:

	cd /mnt/sda1/arduino/yunsocket

Then run the nodejs script:

	node server.js

Go to your browser and access your server. For access from a local network:

	yourYunName.local:8000

If you want to access the server from any network in the world you will first have to forward the ports of the router that manages your local network. and then access it by:

	YOUR.EXTERNAL.IP.ADDRESS:PORT	

ENJOY!!



