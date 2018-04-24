import React from 'react';
import { connect } from 'react-redux';
import { toggleSquares } from '../actions/index';
import { incrementCount } from '../actions/index';


class Square extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hover: '',
    }
  }

  render() {
    console.log('row:', this.props.row, 'column:', this.props.column);
    const isOn = this.props.grid[this.props.row][this.props.column] ? 'is-on' : '';
    return (
      <div
        className={`square ${isOn} ${this.state.hover}`}
        onMouseEnter={()=>{this.setState({hover: 'hover'})}}
        onMouseLeave={()=>this.setState({hover: ''})}
        onClick={()=>{
          this.props.toToggleSquares(this.props.row, this.props.column);
          this.props.toIncrementCount();
        }}>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    grid: state.grid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toToggleSquares: (row, column) => dispatch(toggleSquares(row, column)),
    toIncrementCount: () => dispatch(incrementCount()),
  }
}

Square = connect(mapStateToProps, mapDispatchToProps)(Square);

export default Square;
