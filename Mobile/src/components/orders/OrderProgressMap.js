import { Platform } from 'react-native';
import OrderProgressMapWeb from './OrderProgressMap.web';

let OrderProgressMapComponent;
if (Platform.OS === 'web') {
  OrderProgressMapComponent = OrderProgressMapWeb;
} else {
  OrderProgressMapComponent = require('./OrderProgressMap.native').default;
}

export default OrderProgressMapComponent;
