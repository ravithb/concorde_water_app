import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { styles } from '../styles/styles';
import { getColor } from '../utils/utils';
import GlobalContext from '../contexts/GlobalContext';


const CMD_SPRINKLERS_ON="101";
const CMD_SPRINKLERS_OFF="102";
const CMD_INLET_OPEN = "103";
const CMD_INLET_CLOSE = "104";
interface StatusBox {
  type: string;
  value: string;
  title: string;

}

const HomeScreen: React.FC = ({  }) => {
  const { 
    waterLevel, sprinkelerStatus, pumpStatus, inletValveStatus, runCommand, isConnected, connect
  } = useContext(GlobalContext);


  const [controllerStatus, setControllerStatus] = useState<StatusBox[]>([
    {type:"WaterLevel", value:waterLevel, title:"Water Level"},
    {type:"InletValveStatus", value:inletValveStatus, title:"Inlet Valve"}, 
    {type:"SprinklerStatus", value:sprinkelerStatus, title:"Sprinkler Valve"},
    {type:"PumpStatus", value:pumpStatus, title:"Pump"}
  ]);
  const [manualWatering, setManualWatering] = useState(false);
  const [manualFilling, setManualFilling] = useState(false);
  const [sprinklerBtnEnabled, setSprinkerBtnEnabled] = useState(false);
  const [fillingBtnEnabled, setFillingBtnEnabled] = useState(false);
  
  useEffect(() => {
    setControllerStatus([
      {type:"WaterLevel", value:waterLevel, title:"Water Level"},
      {type:"InletValveStatus", value:inletValveStatus, title:"Inlet Valve"}, 
      {type:"SprinklerStatus", value:sprinkelerStatus, title:"Sprinkler Valve"},
      {type:"PumpStatus", value:pumpStatus, title:"Pump"}
    ]);
    if(!isConnected) {
      setSprinkerBtnEnabled(false);
      setFillingBtnEnabled(false);
      return;
    }

    if(sprinkelerStatus === "OPEN" && pumpStatus === "ON") {
      setSprinkerBtnEnabled(true);
      setManualWatering(false);
    }else if(sprinkelerStatus === "CLOSED" && pumpStatus === "OFF") {
      setSprinkerBtnEnabled(true);
      setManualWatering(true);
    }else if((sprinkelerStatus === "--" && pumpStatus === "--") 
      || (sprinkelerStatus == "CLOSED")) {
      setSprinkerBtnEnabled(true);
      setManualWatering(true);
    }else{
      setSprinkerBtnEnabled(false);
      setManualWatering(false);
    }

    if(inletValveStatus === "OPEN") {
      setFillingBtnEnabled(true);
      setManualFilling(false);
    }else if(inletValveStatus === "CLOSED") {
      setFillingBtnEnabled(true);
      setManualFilling(true);
    }else{
      setFillingBtnEnabled(false);
    }
  }, [waterLevel, sprinkelerStatus, pumpStatus, inletValveStatus, isConnected]);

  const renderCard = ({ item, index }: { item: StatusBox; index: number }) => {
    return <View style={[styles.card, { backgroundColor: getColor(item.type, item.value, isConnected)  }]}>
      <Text style={styles.cardTextTitle}>{item.title}</Text>
      <Text style={styles.cardTextValue}> {item.value}</Text>
    </View>
  };

  const onClickManualWatering = () => {
    setManualWatering(!manualWatering);
    runCommand(manualWatering ? CMD_SPRINKLERS_ON : CMD_SPRINKLERS_OFF);
  }

  const onClickManualFilling = () => {
    setManualFilling(!manualFilling);
    runCommand(manualFilling ? CMD_INLET_OPEN : CMD_INLET_CLOSE);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={controllerStatus}
        numColumns={2}
        renderItem={renderCard}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
      <View style={styles.toggleContainer}>
        {sprinklerBtnEnabled && <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: manualWatering ? styles.statusGreen.color : styles.statusRed.color , marginBottom:5}]}
          onPress={() => {onClickManualWatering()}}
        >
          <Text style={styles.toggleText}>TURN SPRINKLERS {manualWatering ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>}
        {fillingBtnEnabled && <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: manualFilling ? styles.statusGreen.color : styles.statusRed.color , marginBottom:5}]}
          onPress={() => onClickManualFilling()}
        >
          <Text style={styles.toggleText}>TURN FILLING {manualFilling ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>}
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
