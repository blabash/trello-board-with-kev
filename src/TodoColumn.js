import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Todo({ todo, columnId, changeColumn }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <button onClick={() => changeColumn(todo, columnId, 'left')}>
        {'<'}
      </button>
      {todo.todo}
      <button onClick={() => changeColumn(todo, columnId, 'right')}>
        {'>'}
      </button>
    </div>
  );
}

function TodoColumn({
  addTodo,
  moveColumn,
  changeColumn,
  columnName,
  columnId,
  state,
  color,
}) {
  const [todo, setTodo] = useState('');

  return (
    <div
      style={{
        backgroundColor: color,
        margin: '20px',
        minWidth: '150px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <button onClick={() => moveColumn(columnId, 'left')}>{'<'}</button>
        <p style={{ margin: '0' }}>move column</p>
        <button onClick={() => moveColumn(columnId, 'right')}>{'>'}</button>
      </div>
      <h2 style={{ textAlign: 'center' }}>{columnName}</h2>
      {state.todos
        .filter((t) => t.columnId === columnId)
        .map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            changeColumn={changeColumn}
            columnId={columnId}
          />
        ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo(todo, columnId);
          setTodo('');
        }}
      >
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

TodoColumn.propTypes = {
  addTodo: PropTypes.func.isRequired,
  moveColumn: PropTypes.func.isRequired,
  changeColumn: PropTypes.func.isRequired,
  columnName: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
};

export default TodoColumn;
