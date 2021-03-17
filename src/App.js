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

const initialState = { columns: [], todos: [] };

const reducer = (state, { type, payload }) => {
  let columnIdx;
  let newColumnId;
  let newTodo;
  let newTodosList;
  let columnsClone;
  let idxToSwap;

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
      columnIdx = state.columns.findIndex(
        (c) => c.columnId === payload.columnId
      );
      columnsClone = [...state.columns];
      idxToSwap = columnIdx ? columnIdx - 1 : columnsClone.length - 1;

      [columnsClone[columnIdx], columnsClone[idxToSwap]] = [
        columnsClone[idxToSwap],
        columnsClone[columnIdx],
      ];

      return {
        ...state,
        columns: columnsClone,
      };
    case MOVE_RIGHT:
      columnIdx = state.columns.findIndex(
        (c) => c.columnId === payload.columnId
      );

      columnsClone = [...state.columns];
      idxToSwap = columnIdx === columnsClone.length - 1 ? 0 : columnIdx + 1;

      [columnsClone[columnIdx], columnsClone[idxToSwap]] = [
        columnsClone[idxToSwap],
        columnsClone[columnIdx],
      ];

      return {
        ...state,
        columns: columnsClone,
      };
    case TO_LEFT_COLUMN:
      columnIdx = state.columns.findIndex(
        (c) => c.columnId === payload.columnId
      );

      newColumnId = columnIdx
        ? state.columns[columnIdx - 1].columnId
        : state.columns[state.columns.length - 1].columnId;

      newTodo = { ...payload.todo, columnId: newColumnId };
      newTodosList = [
        ...state.todos.filter((t) => t.id !== payload.todo.id),
        newTodo,
      ];

      return {
        ...state,
        todos: newTodosList,
      };
    case TO_RIGHT_COLUMN:
      columnIdx = state.columns.findIndex(
        (c) => c.columnId === payload.columnId
      );

      newColumnId =
        columnIdx === state.columns.length - 1
          ? state.columns[0].columnId
          : state.columns[columnIdx + 1].columnId;

      newTodo = { ...payload.todo, columnId: newColumnId };
      newTodosList = [
        ...state.todos.filter((t) => t.id !== payload.todo.id),
        newTodo,
      ];

      return {
        ...state,
        todos: newTodosList,
      };
    // [a,b] = [b, a]
    // case 'MOVE_COLUMN_RIGHT':
    //   const clone = [...state]
    //   [(clone[idx], clone[idx + 1])] = [
    //     clone[idx + 1],
    //     clone[idx],
    //   ];
    //   return clone;
    default:
      return state;
  }
};

const colors = ['#f5a7a7', '#b3b3fa', '#c4d78d', '#928dd7'];

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [columnName, setColumnName] = useState('');
  const ref = useRef(1);

  function moveColumn(columnId, direction) {
    const type = direction === 'left' ? MOVE_LEFT : MOVE_RIGHT;

    dispatch({
      type,
      payload: {
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
            dispatch={dispatch}
            {...column}
            state={state}
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
