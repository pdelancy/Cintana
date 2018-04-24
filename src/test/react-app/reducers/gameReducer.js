const gameReducer = (state = false, action) => {
  let newState;
  switch (action.type){
    case 'START':
      return !state;
    default:
      return state;
  }
}

export default gameReducer;
