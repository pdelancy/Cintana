import React from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component {
  render() {
    return <div className="counter">{this.props.count}</div>
  }
}

const mapStateToProps = (state) => {
  return {
    count: state.count
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

Counter = connect(mapStateToProps, mapDispatchToProps)(Counter);

export default Counter;
