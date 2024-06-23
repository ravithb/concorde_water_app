import { Dispatch, SetStateAction, createContext } from "react";

interface GlobalContext {
  errorMessage?: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  infoMessage?: string;
  setInfoMessage: Dispatch<SetStateAction<string>>;
  successMessage?: string;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
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
  setLogs: Dispatch<SetStateAction<string[]>>;
  isConnected: boolean;
  connect: () => void;
}

const GlobalContext = createContext<GlobalContext>({
  errorMessage : "",
  setErrorMessage: () => {},
  infoMessage: "",
  setInfoMessage: () => {},
  successMessage: "",
  setSuccessMessage: () => {},
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
  setLogs: () => {},
  isConnected: false,  
  connect: () => {}

});
export default GlobalContext;