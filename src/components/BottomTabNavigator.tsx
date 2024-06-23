import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import LogScreen from './LogScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="CMFC Irrigation Controller" component={HomeScreen} 
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ focused, color, size }) => {
          const icName = focused ? "water" : "water-outline";
          return <Icon name={icName} size={size} color={color} />
        },
        headerTitleAlign: "center",
      }}  />
      <Tab.Screen name="Logs" component={LogScreen} 
      options={{
        tabBarIcon: ({ focused, color, size} ) => {
          const icName = focused ? "terminal" : "terminal-outline";
          return <Icon name={icName} size={size} color={color} />
        }
      }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
