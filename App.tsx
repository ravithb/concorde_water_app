import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './src/components/BottomTabNavigator';
import GlobalState from './src/state/GlobalState';
import MessageBar from './src/components/MessageBar';

const App: React.FC = () => {
  


  return (
    <GlobalState>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
      <MessageBar />
    </GlobalState>
  );
};

export default App;
