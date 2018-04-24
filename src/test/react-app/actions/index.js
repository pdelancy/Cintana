export function toggleSquares(row, column) {
  return({
    type: 'TOGGLE',
    row,
    column,
  })
}

export function newGrid(row, column) {
  return({
    type: 'NEW',
    row,
    column,
  })
}

export function incrementCount() {
  return({
    type: 'ADD'
  })
}

export function clearState(row, column) {
  return({
    type: 'CLEAR',
    row,
    column
  })
}

export function gameStart() {
  return({
    type: 'START'
  })
}
