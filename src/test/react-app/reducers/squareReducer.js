
 const squareReducer = (state = {}, action) => {
   let newState;
   switch (action.type){
     case 'NEW':
     case 'CLEAR':
      newState = {};
      for(let i = 0; i < action.row; i++){
        newState[i] = {};
        for(let j = 0; j < action.column; j++){
          newState[i][j] = false;
        }
      }
      return newState;
     case 'TOGGLE':
       newState = Object.assign({}, state);
       newState[action.row][action.column] = !newState[action.row][action.column];
       if(newState[action.row + 1]){
         newState[action.row + 1][action.column] = !newState[action.row + 1][action.column];
       }
       if(newState[action.row - 1]){
         newState[action.row - 1][action.column] = !newState[action.row - 1][action.column];
       }
       newState[action.row][action.column + 1] = !newState[action.row][action.column + 1];
       newState[action.row][action.column - 1] = !newState[action.row][action.column - 1];
       return newState
      default:
        return state;
   }
 }

 export default squareReducer;
