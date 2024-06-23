import { useContext, useEffect } from "react";
import GlobalContext from "../contexts/GlobalContext";
import Toast from 'react-native-toast-message';
import { Button, Text } from "react-native";

const MessageBar: React.FC = () => {

  const { 
    errorMessage, setErrorMessage,
    infoMessage, setInfoMessage, 
    successMessage, setSuccessMessage } = useContext(GlobalContext);

  useEffect(() => {
    if(errorMessage != "") {
      Toast.show({
        type: 'error',
        text1: errorMessage,
        visibilityTime: 3000,
        autoHide: true,
        onHide: () => {
          setErrorMessage("");
        }
      });
    }
    if(infoMessage != "") {
      Toast.show({
        type: 'info',
        text1: infoMessage,
        visibilityTime: 3000,
        autoHide: true,
        onHide: () => {
          setInfoMessage("");
        }
      });
    }
    if(successMessage != "") {
      Toast.show({
        type: 'success',
        text1: successMessage,
        visibilityTime: 3000,
        autoHide: true,
        onHide: () => {
          setSuccessMessage("");
        }
      });
    }
  }, [errorMessage, infoMessage, successMessage]);

  return <><Toast /></>

};

export default MessageBar;