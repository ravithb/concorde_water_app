import { useEffect, useState } from "react";
import GlobalContext, { Message } from "../contexts/GlobalContext";
import useBLE from "../ble/useBLE";

interface GlobalStateProps {
  children: React.ReactNode;
}

const GlobalState: React.FC<GlobalStateProps> = ({ children }) => {

  const [waterLevel, setWaterLevel] = useState("--");
  const [sprinkelerStatus, setSprinklerStatus] = useState("--");
  const [pumpStatus, setPumpStatus] = useState("--");
  const [inletValveStatus, setInletValveStatus] = useState("--");
  const [message, setMessage] = useState<Message | null>(null);
  const [manualWatering, setManualWatering] = useState(false);
  const [manualFilling, setManualFilling] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout | null>(null);

  const notifyLogs = (logLine: string) => {
    appendLog(logLine);
  }

  const notifyStatus = (statusLine: string) => {
    if (statusLine.startsWith("LEVEL")) {
      setWaterLevel(statusLine.substring(6));
    } else if (statusLine.startsWith("SPRINKLERS")) {
      setSprinklerStatus(statusLine.substring(11));
    } else if (statusLine.startsWith("PUMP")) {
      setPumpStatus(statusLine.substring(5));
    } else if (statusLine.startsWith("INLET")) {
      setInletValveStatus(statusLine.substring(6));
    }
  }

  const {
    requestPermissions,
    scanForPeripherals,
    connectBLEDevice,
    disconnectBLEDevice,
    disconnectHandler,
    controller,
    sendCommand
  } = useBLE({ notifyLogs, notifyStatus });

  useEffect(() => {
    (async () => {
      console.log('calling connect on use effect');
      let status = await connect();
      console.log("Connect returned ", status);
      if (!status) {
        console.log("Retrying to connect to controller");
        setTimeoutHandle(setTimeout(() => {
          connect();
        }, 1000));
      }
    })();
    return () => {
      if (controller != null) {
        disconnectBLEDevice(controller);
      }
      if (timeoutHandle != null) {
        clearTimeout(timeoutHandle);
      }
    }
  }, []);

  useEffect(() => {
    
    (async () => {
      console.log("Scanning complete. found controller ", controller);
      if (controller == null) {
        return;
      }

      if (controller) {
        await connectBLEDevice(controller);
        disconnectHandler(controller, () => {
          console.log("Disconnected from controller");
          setErrorMessage("Disconnected from controller");
          setIsConnected(false);
          // connect();
        }, (error: any) => {
          console.error("Error disconnecting from device", error);
        });
        setIsConnected(controller != null);
        if (controller != null) {
          console.log("Connected to controller", controller.name);
          setInfoMessage("Connected to controller " + controller.name);
        } else {
          setErrorMessage("Failed to connect to controller");
        }

      } else {
        console.log("CMFC Irrigation Controller not found");
        setErrorMessage("CMFC Irrigation Controller not found");
        setIsConnected(false);
      }
    })();
     
  }, [controller]);

  useEffect(() => {
    
  }, [controller]);

  const requestBLEPermissions = async () => {
    const granted = await requestPermissions();
    if (granted) {
      console.log("BLE permissions granted. Scanning for peripherals...");
      await scanForPeripherals();
    } else {
      setErrorMessage("Permission denied to use Bluetooth Low Energy. Please enable it in the settings.");
    }
  };

  const connect = async () => {

    try {
      await requestBLEPermissions();

    } catch (error) {
      console.error("Error scanning for peripherals", error);
      setErrorMessage("Error scanning for peripherals : " + error);
    };
    return false;
  }

  const appendLog = (log: string) => {
    setLogs((oldLogs) => {
      let tmpLogs: string[] = [];
      if (oldLogs.length > 100) {
        tmpLogs = oldLogs.reverse().slice(0, 100).reverse();
      }else{
        tmpLogs = oldLogs;
      }
      return [...tmpLogs, log];
    });
  }


  const setErrorMessage = (message: string) => {
    setMessage({ type: "error", message: message });
  }

  const setSuccessMessage = (message: string) => {
    setMessage({ type: "success", message: message });
  }

  const setInfoMessage = (message: string) => {
    setMessage({ type: "info", message: message });
  }

  const runCommand = (cmd: string) => {
    if (controller != null) {
      sendCommand(controller, cmd);
    } else {
      setErrorMessage("Not connected to controller");
    }
  }


  return <GlobalContext.Provider value={{
    message, setMessage,
    waterLevel, setWaterLevel,
    sprinkelerStatus, setSprinklerStatus,
    pumpStatus, setPumpStatus,
    inletValveStatus, setInletValveStatus,
    manualWatering, setManualWatering,
    manualFilling, setManualFilling,
    logs, appendLog,
    isConnected, connect,
    setErrorMessage,
    setInfoMessage,
    setSuccessMessage,
    runCommand
  }}>
    {children}
  </GlobalContext.Provider>;
};

export default GlobalState;