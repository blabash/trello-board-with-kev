import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

function TodoColumn({ dispatch, columnName, columnId, state, color }) {
  const [todo, setTodo] = useState('');

  function addTodo(e) {
    e.preventDefault();
    if (!todo) return;
    dispatch({
      type: 'ADD_TODO',
      payload: {
        id: Math.random().toString(36).substring(7),
        todo,
        columnId,
      },
    });
    setTodo('');
  }
  return (
    <div
      style={{
        backgroundColor: color,
        margin: '20px',
        minWidth: '150px',
        borderRadius: '5px',
      }}
    >
      <h2>{columnName}</h2>
      {state.todos
        .filter((t) => t.columnId === columnId)
        .map((todo) => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <button>{'<'}</button>
            {todo.todo}
            <button>{'>'}</button>
          </div>
        ))}
      <form onSubmit={addTodo}>
        <input
          type='text'
          value={todo}
          name=''
          id=''
          placeholder='Add new todo'
          onChange={(e) => setTodo(e.target.value)}
        />
        <button>Add</button>
      </form>
    </div>
  );
}

TodoColumn.propTypes = {};

export default TodoColumn;
