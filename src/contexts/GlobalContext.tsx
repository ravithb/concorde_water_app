import { Dispatch, SetStateAction, createContext } from "react";
import { Device } from "react-native-ble-plx";

export interface Message {
  type: string;
  message: string;
}

interface GlobalContext {
  message: Message | null;
  setMessage: Dispatch<SetStateAction<Message | null>>;
  waterLevel: string;
  setWaterLevel: Dispatch<SetStateAction<string>>;
  sprinkelerStatus: string;
  setSprinklerStatus: Dispatch<SetStateAction<string>>;
  pumpStatus: string;
  setPumpStatus: Dispatch<SetStateAction<string>>;
  inletValveStatus: string;
  setInletValveStatus: Dispatch<SetStateAction<string>>;
  manualWatering: boolean;
  setManualWatering: Dispatch<SetStateAction<boolean>>;
  manualFilling: boolean;
  setManualFilling: Dispatch<SetStateAction<boolean>>;
  logs: string[];
  appendLog: (log: string) => void;
  isConnected: boolean;
  connect: () => void;
  setErrorMessage: (m:string) => void;
  setInfoMessage: (m:string) => void;
  setSuccessMessage: (m:string) => void;
  runCommand: (cmd: string) => void;
}

const GlobalContext = createContext<GlobalContext>({
  message : null,
  setMessage: () => {},
  waterLevel: "",
  setWaterLevel: () => {},
  sprinkelerStatus: "",
  setSprinklerStatus: () => {},
  pumpStatus: "",
  setPumpStatus: () => {},
  inletValveStatus: "",
  setInletValveStatus: () => {},
  manualWatering: false,
  setManualWatering: () => {},
  manualFilling: false,
  setManualFilling: () => {},
  logs: [],
  appendLog: () => {},
  isConnected: false,  
  connect: () => {},
  setInfoMessage: () => {},
  setErrorMessage: () => {},
  setSuccessMessage: () => {},
  runCommand: () => {}
});
export default GlobalContext;