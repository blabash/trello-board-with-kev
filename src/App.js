import React, { useState, useReducer, useRef } from 'react';
import './App.css';

import {
  ADD_TODO,
  ADD_COLUMN,
  CHANGE_COLUMN,
  MOVE_COLUMN,
} from './actionTypes';

import TodoColumn from './TodoColumn';

function moveColumn(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  let idxToSwapWith;
  if (payload.direction === 'left') {
    idxToSwapWith = columnIdx ? columnIdx - 1 : state.columns.length - 1;
  } else {
    idxToSwapWith = columnIdx === state.columns.length - 1 ? 0 : columnIdx + 1;
  }

  const modifiedColumns = [...state.columns];
  [modifiedColumns[columnIdx], modifiedColumns[idxToSwapWith]] = [
    modifiedColumns[idxToSwapWith],
    modifiedColumns[columnIdx],
  ];

  return modifiedColumns;
}

function changeColumn(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  let newColumnId;
  if (payload.direction === 'left') {
    newColumnId = columnIdx
      ? state.columns[columnIdx - 1].columnId
      : state.columns[state.columns.length - 1].columnId;
  } else {
    newColumnId =
      columnIdx === state.columns.length - 1
        ? state.columns[0].columnId
        : state.columns[columnIdx + 1].columnId;
  }

  const newTodo = { ...payload.todo, columnId: newColumnId };
  const newTodosList = [
    ...state.todos.filter((t) => t.id !== payload.todo.id),
    newTodo,
  ];

  return newTodosList;
}

const initialState = { columns: [], todos: [] };

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ADD_COLUMN:
      return {
        ...state,
        columns: [...state.columns, payload],
      };

    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, payload],
      };

    case MOVE_COLUMN:
      return {
        ...state,
        columns: moveColumn(state, payload),
      };

    case CHANGE_COLUMN:
      return {
        ...state,
        todos: changeColumn(state, payload),
      };

    default:
      return state;
  }
};

const colors = ['#f5a7a7', '#b3b3fa', '#c4d78d', '#928dd7'];

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [columnName, setColumnName] = useState('');
  const ref = useRef(1);

  function addNewColumn(e) {
    e.preventDefault();
    if (!columnName) return;
    dispatch({
      type: ADD_COLUMN,
      payload: {
        columnName,
        columnId: Math.random().toString(36).substring(7),
        color: colors[ref.current % colors.length],
      },
    });
    setColumnName('');
    ref.current === colors.length ? (ref.current = 1) : (ref.current += 1);
  }

  function moveColumn(columnId, direction) {
    dispatch({
      type: MOVE_COLUMN,
      payload: {
        columnId,
        direction,
      },
    });
  }

  function addTodo(todo, columnId) {
    if (!todo) return;
    dispatch({
      type: ADD_TODO,
      payload: {
        id: Math.random().toString(36).substring(7),
        todo,
        columnId,
      },
    });
  }

  function changeColumn(todo, columnId, direction) {
    dispatch({
      type: CHANGE_COLUMN,
      payload: {
        todo,
        columnId,
        direction,
      },
    });
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h1>TRELLOLOLOLOL</h1>
      <hr style={{ width: '100%' }}></hr>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        {state.columns.map((column, idx) => (
          <TodoColumn
            key={idx}
            {...column}
            state={state}
            addTodo={addTodo}
            changeColumn={changeColumn}
            moveColumn={moveColumn}
          />
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
