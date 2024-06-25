import { styles } from "../styles/styles";

export function getColor(type: string, value: string, isConnected:boolean): string {
  if(!isConnected) {
    return styles.statusGray.color;
  }
  if (type === "WaterLevel") {
    switch(value) {
      case "LOW":
        return styles.statusRed.color;
      case "MED":
        return styles.statusYellow.color;
      case "HIGH":
        return styles.statusGreen.color;
      case "--":
      case "":
      default:
        return styles.statusGray.color;
    }

  } else if(type === "InletValveStatus" || type === "SprinklerStatus" ) {
    switch(value) {
      case "OPEN":
        return styles.statusGreen.color;
      case "CLOSED":
        return styles.statusBlue.color;
      case "--":
      case "":
        return styles.statusGray.color;
      default:
        return styles.statusYellow.color;
    }
  }else {
    switch(value) {
      case "ON":
        return styles.statusGreen.color;
      case "FAILED":
        return styles.statusRed.color;
      case "OFF":
        return styles.statusBlue.color
      case "--":
      case "":
        return styles.statusGray.color;
      default:
        return styles.statusYellow.color;
    }

  }
}