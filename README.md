# Kordata USB-Bluetooth Bridge
The Kordata USB-Bluetooth Bridge is a software package that runs on a Raspberry Pi. You can connect to devices over USB or GPIO by writing a driver file. Commands can be sent to the bridge through Bluetooth or ethernet/wifi to capture data. In the future, data will be able to be captured on a schedule or in response to an event and pushed into the cloud automatically.

## Dependencies
You need node installed and on the path.

The Raspian OS needs these packages added:

```
sudo apt-get install build-essential libudev-dev bluetooth bluez libbluetooth-dev
```


## Drivers
To write a driver for a device, you need to add a file to the 'drivers' folder that extends the Driver class. Then add an entry to index.js for your driver. Inside your driver class you can access whatever system resoucres you need, then just return your data as a JSON object.

## Service
To install the bridge as a service on your pi, modifiy the usb-bridge.service file with the location you installed the software. You can install the IOT-ifier as a service on your pi by running the following:

CRON:
```
sudo crontab -e
@reboot sleep 5 && /home/pi/start_bridge
```

SYSTEMD (NOT WORKING ON BUSTER):
```
sudo cp usb-bridge.service /etc/systemd/system/.
sudo systemctl enable usb-bridge.service
```

That's all there is to it!
