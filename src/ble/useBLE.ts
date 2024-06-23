/* eslint-disable no-bitwise */

import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Device } from "react-native-ble-plx";
import base64 from 'react-native-base64';

import * as ExpoDevice from 'expo-device';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  allDevices: Device[];
  connectBLEDevice(device: Device): void;
  disconnectBLEDevice(device: Device): void;
  connectedDevice: Device | null;
  disconnectHandler(device: Device, onDisconnect: Function, onError: Function | null): void;
}

const DEVICE_NAME = "CMFC_IRRIGATION";
const SERVICE_UUID = "c0ae3000-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_STATUS_UUID = "c0ae3001-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_LOGS_UUID = "c0ae3002-da8a-45c6-a5c5-fbad540c2bf3";
const CHARACTERISTIC_COMMANDS_UUID = "c0ae3003-da8a-45c6-a5c5-fbad540c2bf3";

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

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

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) => 
    devices.findIndex((device) => device.id === nextDevice.id) > -1;

  const scanForPeripherals = () => {
    bleManager.startDeviceScan([SERVICE_UUID], null, (error, device) => {
      if(error) {
        console.error("Error scanning for devices", error);
        return;
      }
      if(device && device.name?.includes(DEVICE_NAME)) {
        setAllDevices((prevDevices) => {
          if(isDuplicateDevice(prevDevices, device) === false) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  }
  
  const startDataListener = async (device: Device) => {
    if(device != null) {
      device.monitorCharacteristicForService(
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
          console.log("Status characteristic value: ", characteristic?.value);
          console.log(base64.decode(characteristic.value));
        }
      );
    }
  };

  const connectBLEDevice = async (device: Device) => {
    try{
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startDataListener(deviceConnection);
    }catch(e){
      console.error("Error connecting to device", e); 
    }
  }


  const disconnectBLEDevice = async (device: Device) => {
    try{
      const deviceConnection = await bleManager.cancelDeviceConnection(device.id);
      setConnectedDevice(null);      
    }catch(e){
      console.error("Error disconnecting from device", e); 
    }
  }

  const disconnectHandler = (device:Device, onDisconnect:Function, onError:Function | null) => {
    bleManager.onDeviceDisconnected(device?.id, (error:BleError | null, device:Device | null) => {
      if(error && onError) {
        onError(error);
      }
      onDisconnect(device);
    });
  }

  return {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectBLEDevice,
    disconnectBLEDevice,
    connectedDevice,
    disconnectHandler
  };
}

export default useBLE;