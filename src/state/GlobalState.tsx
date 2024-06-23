import { useEffect, useState } from "react";
import GlobalContext from "../contexts/GlobalContext";
import useBLE from "../ble/useBLE";

interface GlobalStateProps {
  children: React.ReactNode;
}

const GlobalState: React.FC<GlobalStateProps> = ({ children }) => {

  const [waterLevel, setWaterLevel] = useState("--");
  const [sprinkelerStatus, setSprinklerStatus] = useState("--");
  const [pumpStatus, setPumpStatus] = useState("--");
  const [inletValveStatus, setInletValveStatus] = useState("--");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [manualWatering, setManualWatering] = useState(false);
  const [manualFilling, setManualFilling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const {
    requestPermissions,
    scanForPeripherals,
    connectBLEDevice,
    disconnectBLEDevice,
    disconnectHandler,
    connectedDevice,
    allDevices,
  } = useBLE();

  useEffect(() => {
    connect();
    return () => {
      if(connectedDevice != null) {
        disconnectBLEDevice(connectedDevice);
      }
    }
  },[]);

  useEffect(() => {
    setIsConnected(connectedDevice != null);
  }, [connectedDevice]);


  const connect = () => {
    const requestBLEPermissions = async () => {
      const granted = await requestPermissions();
      if (granted) {
        console.log("BLE permissions granted. Scanning for peripherals...");
        scanForPeripherals();
      }else{
        setErrorMessage("Permission denied to use Bluetooth Low Energy. Please enable it in the settings.");
      }
    };

    requestBLEPermissions().then(async () => {
      console.log("Scanning complete. found controller ", allDevices.length);
      if(allDevices.length > 0) {
        await connectBLEDevice(allDevices[0]);
        disconnectHandler(allDevices[0], () => {
          console.log("Disconnected from controller");
          setErrorMessage("Disconnected from controller");
          connect();
        }, (error: any) => {
          console.error("Error disconnecting from device", error);
        });
        if(connectedDevice != null) {
          console.log("Connected to controller", connectedDevice.name);
          setSuccessMessage("Connected to controller " + connectedDevice.name);
        }else{
          setErrorMessage("Failed to connect to controller");
        }
      }else{
        // console.log("CMFC Irrigation Controller not found");
        setErrorMessage("CMFC Irrigation Controller not found");      
      }
    });

  }

  return <GlobalContext.Provider value={{ 
    errorMessage, setErrorMessage,
    infoMessage, setInfoMessage,
    successMessage, setSuccessMessage,
    waterLevel, setWaterLevel,
    sprinkelerStatus, setSprinklerStatus,
    pumpStatus, setPumpStatus,
    inletValveStatus, setInletValveStatus,
    manualWatering, setManualWatering,
    manualFilling, setManualFilling,
    logs, setLogs,
    isConnected, connect
    }}>
    {children}
  </GlobalContext.Provider>;
};

export default GlobalState;