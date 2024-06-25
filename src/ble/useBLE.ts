/* eslint-disable no-bitwise */

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Device } from "react-native-ble-plx";
import base64 from 'react-native-base64';

import * as ExpoDevice from 'expo-device';

interface BLEListeners {
  notifyStatus: Function;
  notifyLogs: Function;
}
interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  controller: Device | null;
  connectBLEDevice(device: Device): void;
  disconnectBLEDevice(device: Device): void;
  disconnectHandler(device: Device, onDisconnect: Function, onError: Function | null): void;
  sendCommand(device: Device, command: string): void;
}

const DEVICE_NAME = "CMFC_IRRIGATION";
const SERVICE_UUID = "c0ae3000-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_STATUS_UUID = "c0ae3001-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_LOGS_UUID = "c0ae3002-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_COMMANDS_UUID = "c0ae3003-da8a-45c6-a5c5-fbad540c2bf3";

function useBLE({notifyStatus, notifyLogs}:BLEListeners): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [controller, setController] = useState<Device | null>(null);  
  const [statusMonitorSubscription, setStatusMonitorSubscription ] = useState<any | null>(null);
  const [logsMonitorSubscription, setLogsMonitorSubscription ] = useState<any | null>(null);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    if(bluetoothScanPermissions["android.permission.BLUETOOTH_SCAN"] === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothScanPermissions["android.permission.BLUETOOTH_CONNECT"] === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothScanPermissions["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    return false;
  }

  const requestPermissions = async (): Promise<boolean> => {
    if(Platform.OS === "android") {
      if((ExpoDevice.platformApiLevel?? -1) < 31) {
        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return locationPermission === PermissionsAndroid.RESULTS.GRANTED;
      }else{
        return await requestAndroid31Permissions();
      
      } 
    }else{
      return true;    
    }
  };

  const scanForPeripherals = async () => {
    console.log("Starting device scan...");
    await bleManager.startDeviceScan([SERVICE_UUID], null, async (error, device) => {
      
      if(error) {
        console.error("Error scanning for devices", error);
        return;
      }
      if(device && device.name?.includes(DEVICE_NAME)) {
        
        setController((oldDevice)=>{
          if(!oldDevice) {
            console.log("Device found listner ", error, device?.name);
            return device;
          }
          return oldDevice;
        });
        
        
        // await bleManager.stopDeviceScan();
        // console.log('device found scan stopped')
      }
    });
  }
  
  const startDataListener = async (device: Device) => {
    if(device != null) {
      console.log("Starting data listener for device", device.name);
      const $sm = device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_STATUS_UUID,
        (error, characteristic) => {
          if(error) {
            console.error("Error monitoring characteristic", error);
            return;
          }
          if(characteristic == null) {
            console.error("No data received from characteristic");
            return;
          }
          const statusLine = base64.decode(characteristic?.value);
          console.log("Status characteristic value: ", statusLine);
          notifyStatus(statusLine);
        }
      );
      const $lm = device.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_LOGS_UUID,
        (error, characteristic) => {
          if(error) {
            console.error("Error monitoring logs characteristic", error);
            return;
          }
          if(characteristic == null) {
            console.error("No data received from logs characteristic");
            return;
          }
          const logLine = base64.decode(characteristic?.value);
          notifyLogs(logLine);
        }
      );
      setStatusMonitorSubscription($sm);
      setLogsMonitorSubscription($lm);
    }
  };

  const connectBLEDevice = async (device: Device) => {
    try{
      const deviceConnection = await bleManager.connectToDevice(device.id);
      bleManager.requestMTUForDevice(device.id, 128);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      await bleManager.stopDeviceScan();
      startDataListener(deviceConnection);
    }catch(e){
      console.error("Error connecting to device", e); 
    }
  }


  const disconnectBLEDevice = async (device: Device) => {
    console.log("Disconnecting from device", device.name);
    try{
      const deviceConnection = await bleManager.cancelDeviceConnection(device.id);
    }catch(e){
      console.error("Error disconnecting from device", e); 
    }
  }

  const disconnectHandler = (device:Device, onDisconnect:Function, onError:Function | null) => {
    bleManager.onDeviceDisconnected(device?.id, (error:BleError | null, device:Device | null) => {
      if(error && onError) {
        onError(error);
      }
      if(statusMonitorSubscription != null) {
        statusMonitorSubscription.remove();
      }
      if(logsMonitorSubscription != null) {
        logsMonitorSubscription.remove();
      }
      onDisconnect(device);
      setController(null);
    });
  }

  const sendCommand = async (device: Device, command: string) => {
    device.writeCharacteristicWithoutResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_COMMANDS_UUID,
      base64.encode(command)
    );
  }

  return {
    requestPermissions,
    scanForPeripherals,
    controller,
    connectBLEDevice,
    disconnectBLEDevice,
    disconnectHandler,
    sendCommand
  };
}

export default useBLE;