import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import squareReducer from './squareReducer';
import countReducer from './countReducer';
import gameReducer from './gameReducer';


const rootReducer = combineReducers({
  grid: squareReducer,
  count: countReducer,
  gameStarted: gameReducer,
  routing,
});

export default rootReducer;
