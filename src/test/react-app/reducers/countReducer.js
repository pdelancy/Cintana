const countReducer = (state = 0, action) => {
  let newState;
  switch (action.type){
    case 'ADD':
      return state + 1;
    case 'CLEAR':
      return 0;
    default:
      return state;
  }
}

export default countReducer;
