import React from 'react';
import Square from './Square';
import Counter from './Counter';
import { connect } from 'react-redux';
import { newGrid } from '../actions/index';
import { clearState, gameStart } from '../actions/index';

class Gameboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: 0,
    }
  }

  render() {
    return <div>
      <div className="board">
        {Array(Object.keys(this.props.grid).length).fill('').map((row, y) => {
          return (<div className="row" key={y}>
            {Array(Object.keys(this.props.grid[0]).length).fill('').map((square, x) => {
              let key = `${x}${y}`;
              return (
                <Square key={key} row={x} column={y}/>
              )
            })}
          </div>)
        })}
      </div>
      <div className="game-footer">
        <button className="reset" onClick={()=>this.props.toGameStart()}>Back</button>
        <span><Counter/></span>
        <button className="reset" onClick={()=>this.props.toClearState(this.props.height, this.props.width)}>Reset</button>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    grid: state.grid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toNewGrid: (row, column) => dispatch(newGrid(row, column)),
    toClearState: (row, column) => dispatch(clearState(row, column)),
    toGameStart: () => dispatch(gameStart())
  }
}

Gameboard = connect(mapStateToProps, mapDispatchToProps)(Gameboard);

export default Gameboard;
