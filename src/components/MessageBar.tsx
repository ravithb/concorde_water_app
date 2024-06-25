import { useContext, useEffect } from "react";
import GlobalContext from "../contexts/GlobalContext";
import Toast from 'react-native-toast-message';
import { Button, Text } from "react-native";

const MessageBar: React.FC = () => {

  const { message, setMessage} = useContext(GlobalContext);

  useEffect(() => {
    if(message != null) {
      Toast.show({
        type: message.type,
        text1: message.message,
        visibilityTime: 3000,
        autoHide: true,
        onHide: () => {
          setMessage(null);
        }
      });
    }
  }, [message]);

  return <><Toast /></>

};

export default MessageBar;