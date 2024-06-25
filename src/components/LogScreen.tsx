import React, { useContext } from 'react';
import { ScrollView, Text } from 'react-native';
import { styles } from '../styles/styles';
import GlobalContext from '../contexts/GlobalContext';

const LogScreen: React.FC = () => {
  const {logs} = useContext(GlobalContext);

  return (
    <ScrollView style={styles.logContainer}>
      {logs.map((log, index) => (
        <Text key={index} style={styles.logText}>{log}</Text>
      ))}
    </ScrollView>
  );
};

export default LogScreen;
