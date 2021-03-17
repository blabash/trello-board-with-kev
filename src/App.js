import React, { useState, useReducer, useRef } from 'react';
import './App.css';

import {
  ADD_TODO,
  ADD_COLUMN,
  TO_LEFT_COLUMN,
  TO_RIGHT_COLUMN,
  MOVE_LEFT,
  MOVE_RIGHT,
} from './actionTypes';

import TodoColumn from './TodoColumn';

function moveLeft(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );
  const columnsClone = [...state.columns];
  const idxToSwap = columnIdx ? columnIdx - 1 : columnsClone.length - 1;

  [columnsClone[columnIdx], columnsClone[idxToSwap]] = [
    columnsClone[idxToSwap],
    columnsClone[columnIdx],
  ];

  return columnsClone;
}

function moveRight(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  const columnsClone = [...state.columns];
  const idxToSwap = columnIdx === columnsClone.length - 1 ? 0 : columnIdx + 1;

  [columnsClone[columnIdx], columnsClone[idxToSwap]] = [
    columnsClone[idxToSwap],
    columnsClone[columnIdx],
  ];

  return columnsClone;
}

function toLeftColumn(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  const newColumnId = columnIdx
    ? state.columns[columnIdx - 1].columnId
    : state.columns[state.columns.length - 1].columnId;

  const newTodo = { ...payload.todo, columnId: newColumnId };
  const newTodosList = [
    ...state.todos.filter((t) => t.id !== payload.todo.id),
    newTodo,
  ];

  return newTodosList;
}

function toRightColumn(state, payload) {
  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  const newColumnId =
    columnIdx === state.columns.length - 1
      ? state.columns[0].columnId
      : state.columns[columnIdx + 1].columnId;

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

    case MOVE_LEFT:
      return {
        ...state,
        columns: moveLeft(state, payload),
      };

    case MOVE_RIGHT:
      return {
        ...state,
        columns: moveRight(state, payload),
      };

    case TO_LEFT_COLUMN:
      return {
        ...state,
        todos: toLeftColumn(state, payload),
      };

    case TO_RIGHT_COLUMN:
      return {
        ...state,
        todos: toRightColumn(state, payload),
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
    const type = direction === 'left' ? MOVE_LEFT : MOVE_RIGHT;

    dispatch({
      type,
      payload: {
        columnId,
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
    const type = direction === 'left' ? TO_LEFT_COLUMN : TO_RIGHT_COLUMN;

    dispatch({
      type,
      payload: {
        todo,
        columnId,
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
