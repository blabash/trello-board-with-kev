import React, { useState, useReducer } from 'react';

import './App.css';
import TodoColumn from './TodoColumn';

// const [todos, setTodos] = useState(
//   [{colName: 'notStarted', colIdx: 0, colEntries: [
//     {id: 0912, todo: 'wash the dog'}
//   ]},
//   [{colName: 'inProgress', colIdx: 1, colEntries: [
//     {id: 0912, todo: 'wash the dog', colIdx: 1}
//   ]},
//   [{colName: 'completed', colIdx: 2, colEntries: [
//     {id: 0912, todo: 'wash the dog'}
//   ]},
// ])

const initialState = { columns: [], todos: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [...state.columns, payload],
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, payload],
      };
      // [a,b] = [b, a]
      // case 'MOVE_COLUMN_RIGHT':
      //   const clone = [...state]
      //   [(clone[idx], clone[idx + 1])] = [
      //     clone[idx + 1],
      //     clone[idx],
      //   ];
      //   return clone;
      break;
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [columnName, setColumnName] = useState('');

  function addNewColumn(e) {
    e.preventDefault();
    if (!columnName) return;
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        columnName,
        columnId: Math.random().toString(36).substring(7),
      },
    });
    setColumnName('');
  }
  console.log(state);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ display: 'flex' }}>
        {state.columns.map((column, idx) => (
          <TodoColumn key={idx} dispatch={dispatch} {...column} state={state} />
        ))}
      </div>
      <form onSubmit={addNewColumn}>
        <input
          type='text'
          value={columnName}
          placeholder='Add a new column'
          onChange={(e) => setColumnName(e.target.value)}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

export default App;
