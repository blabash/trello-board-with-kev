import React, { useState, useReducer, useRef } from 'react';
import './App.css';

import {
  ADD_TODO,
  ADD_COLUMN,
  CHANGE_COLUMN,
  MOVE_COLUMN,
  RENAME_COLUMN,
  DELETE_COLUMN,
} from './actionTypes';

import TodoColumn from './TodoColumn';

function Modal({ children, closeModal }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0, 0.5)',
      }}
      onClick={closeModal}
    >
      <div
        style={{
          padding: '30px',
          position: 'absolute',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

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

function renameColumn(state, payload) {
  const column = state.columns.find((c) => c.columnId === payload.columnId);
  const renamedColumn = { ...column, columnName: payload.newColumnName };

  const columnIdx = state.columns.findIndex(
    (c) => c.columnId === payload.columnId
  );

  const renamedColumns = [
    ...state.columns.slice(0, columnIdx),
    renamedColumn, //maintain column order
    ...state.columns.slice(columnIdx + 1),
  ];

  return renamedColumns;
}

function deleteColumn(state, payload) {
  return state.columns.filter((c) => c.columnId !== payload.columnId);
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

    case RENAME_COLUMN:
      return {
        ...state,
        columns: renameColumn(state, payload),
      };

    case DELETE_COLUMN:
      return {
        ...state,
        columns: deleteColumn(state, payload),
      };

    default:
      return state;
  }
};

const colors = ['#f5a7a7', '#b3b3fa', '#c4d78d', '#928dd7'];

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [columnName, setColumnName] = useState('');
  const [modal, setModal] = useState(null);
  const ref = useRef(1);

  function closeModal(e) {
    e.preventDefault();
    setModal(null);
  }

  function renameColumn(e) {
    e.preventDefault();
    if (!e.target[0].value) return;
    dispatch({
      type: RENAME_COLUMN,
      payload: {
        columnId: e.target.id,
        newColumnName: e.target[0].value,
      },
    });
    setModal(null);
  }

  function deleteColumn(columnId) {
    dispatch({
      type: DELETE_COLUMN,
      payload: {
        columnId,
      },
    });
    setModal(null);
  }

  function showColumnRenameModal(columnId, columnName) {
    setModal(
      <Modal closeModal={closeModal}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button style={{ cursor: 'pointer' }} onClick={closeModal}>
            x
          </button>
        </div>
        <h3 style={{ margin: '0 0 10px 0' }}>Rename {columnName}?</h3>
        <form id={columnId} onSubmit={renameColumn}>
          <input type='text' placeholder='Add a new name' />
          <button style={{ cursor: 'pointer' }}>Update</button>
        </form>
      </Modal>
    );
  }

  function showColumnDeleteModal(columnId, columnName) {
    setModal(
      <Modal closeModal={closeModal}>
        <div style={{ alignSelf: 'flex-end' }}>
          <button style={{ cursor: 'pointer' }} onClick={closeModal}>
            X
          </button>
        </div>
        <h3 style={{ margin: '0 0 10px 0' }}>Really delete {columnName}?</h3>
        <button
          style={{ cursor: 'pointer' }}
          onClick={() => deleteColumn(columnId)}
        >
          Yes
        </button>
      </Modal>
    );
  }

  function addNewColumn(e) {
    e.preventDefault();
    if (!columnName) return;
    if (state.columns.length >= 5) return;
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
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      {modal}
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
            showColumnRenameModal={showColumnRenameModal}
            showColumnDeleteModal={showColumnDeleteModal}
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
