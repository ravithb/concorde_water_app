import { styles } from "../styles/styles";

export function getColor(type: string, value: string, isConnected:boolean): string {
  if(!isConnected) {
    return styles.statusGray.color;
  }
  if (type === "WaterLevel") {
    if (value === "Low") {
      return styles.statusRed.color;
    } else if (value === "Medium") {
      return styles.statusYellow.color;
    } else {
      return styles.statusGreen.color;
    }

  } else {
    return value === "ON" ? styles.statusGreen.color : styles.statusRed.color;
  }
}