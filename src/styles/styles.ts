import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  flatListContainer: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 20,
    minHeight: 100,
    width: '45%',
    borderRadius: 10,
    alignItems: 'stretch',
  },
  cardTextTitle: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  cardTextValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  toggleContainer: {
    justifyContent: 'space-around',
    width: '100%',
  },
  toggleButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logContainer: {
    flex: 1,
    padding: 16,
  },
  logText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonBlue: {
    color: '#82A8C9'
  },

  statusRed:{
    color: '#e06666'
  },
  statusGreen:{
    color: '#6aa84f'
  },
  statusYellow:{
    color: '#ffbd33'
  },
  statusBlue:{
    color: '#82A8C9'
  },
  statusGray:{
    color: '#666666'
  }
});
