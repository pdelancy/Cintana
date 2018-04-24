import React from 'react';
import ReactDOM from 'react-dom';
import Gameboard from './components/Gameboard.js';
import Selections from './components/Selections';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducers/index';
import { connect } from 'react-redux';
import './master.css';

const store = createStore(rootReducer);

class App extends React.Component {
  render() {
    return <div>
      {this.props.gameStarted ? <Gameboard /> : <Selections/>}
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    gameStarted: state.gameStarted
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

App = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
