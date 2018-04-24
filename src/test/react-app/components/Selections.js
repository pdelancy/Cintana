import React from 'react';
import { connect } from 'react-redux';
import { gameStart, newGrid } from '../actions/index';
class Selections extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: 3,
      columns: 3
    }
  }
  render() {
    console.log(this.state.rows, this.state.columns);
    return (
      <div>
        <h1>LIGHT PUZZLES</h1>
        <select value={this.state.rows} onChange={(e)=>this.setState({rows: parseInt(e.target.value)})}>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </select>
        <select value={this.state.columns} onChange={(e)=>this.setState({columns: parseInt(e.target.value)})}>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </select>
        <div >
          <button className="reset"
            style={{width: '200px', margin: '20px'}}
            onClick={() => {
              this.props.toNewGrid(this.state.columns, this.state.rows);
              this.props.toGameStart();
            }}>
            {"Start Game"}
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gameStarted: state.gameStarted,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toNewGrid: (row, column) => dispatch(newGrid(row, column)),
    toGameStart: () => dispatch(gameStart()),
  }
}

Selections = connect(mapStateToProps, mapDispatchToProps)(Selections);

export default Selections;
