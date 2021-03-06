import { StackNavigator } from 'react-navigation';
import HomePage from './HomePage';
import SourcePage from './SourcePage';
import AboutPage from './AboutPage';
import NotificationsPage from './NotificationsPage';

const App = StackNavigator({
  Home: { screen: HomePage },
  Source: { screen: SourcePage},
  About: { screen: AboutPage},
  Notifications: { screen: NotificationsPage }
});

export default App;
