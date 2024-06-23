import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles/styles';
import { getColor } from '../utils/utils';
import GlobalContext from '../contexts/GlobalContext';

interface StatusBox {
  type: string;
  value: string;
  title: string;

}

const HomeScreen: React.FC = ({  }) => {
  const { 
    waterLevel, sprinkelerStatus, pumpStatus, inletValveStatus, errorMessage, setErrorMessage, isConnected, connect
  } = useContext(GlobalContext);


  const [machineStatus, setMachineStatus] = useState<StatusBox[]>([
    {type:"WaterLevel", value:waterLevel, title:"Water Level"},
    {type:"InletValveStatus", value:inletValveStatus, title:"Inlet Valve"}, 
    {type:"SprinklerStatus", value:sprinkelerStatus, title:"Sprinkler Valve"},
    {type:"PumpStatus", value:pumpStatus, title:"Pump"}
  ]);
  const [system1, setSystem1] = useState(false);
  const [system2, setSystem2] = useState(false);
  const [count, setCount] = useState(0);

  const renderCard = ({ item, index }: { item: StatusBox; index: number }) => {
    return <View style={[styles.card, { backgroundColor: getColor(item.type, item.value, isConnected)  }]}>
      <Text style={styles.cardTextTitle}>{item.title}</Text>
      <Text style={styles.cardTextValue}> {item.value}</Text>
    </View>
  };

  const onClickManualWatering = () => {
    console.log("Manual watering clicked");
    setCount(count + 1);
    setErrorMessage("Manual watering started"+count);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={machineStatus}
        numColumns={2}
        renderItem={renderCard}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: system1 ? 'green' : 'grey' , marginBottom:5}]}
          onPress={() => {onClickManualWatering();setSystem1(!system1)}}
        >
          <Text style={styles.toggleText}>Sprinklers: {system1 ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: system2 ? 'green' : 'grey' , marginBottom:5}]}
          onPress={() => setSystem2(!system2)}
        >
          <Text style={styles.toggleText}>Filling: {system2 ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        {!isConnected && <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: styles.buttonBlue.color , marginBottom:5}]}
          onPress={() => {connect()}}
        >
          <Text style={styles.toggleText}>Connect</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default HomeScreen;
