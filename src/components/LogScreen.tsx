import React from 'react';
import { ScrollView, Text } from 'react-native';
import { styles } from '../styles/styles';

const LogScreen: React.FC = () => {
  const logs = [
    'Log entry 1',
    'Log entry 2',
    'Log entry 3',
    'Log entry 4',
    'Log entry 5',
  ];

  return (
    <ScrollView style={styles.logContainer}>
      {logs.map((log, index) => (
        <Text key={index} style={styles.logText}>{log}</Text>
      ))}
    </ScrollView>
  );
};

export default LogScreen;
