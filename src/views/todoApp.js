// Simple component to illustrate the use of a simple crud reducer hook.

import React from 'react';

import useCrudReducer from '../hooks/use_crud_reducer';
import todoSchema from '../schemas/todo_schema';
import Form from '../components/form';
import TreeProperties from '../components/tree_properties';

import useMousePosition from '../hooks/use_mouse_position';

const TodoApp = () => {
  const [state, _dispatch, actions] = useCrudReducer();
  const { add, remove } = actions;

  // Just for demo, it tracks down mouse movement :-)
  const position = useMousePosition();

  const handleSubmit = formState => add(formState);

  // console.log(state);

  const content = Object.keys(state)
    .map(uuid => {
      return <li key={uuid}>
        <TreeProperties object={state[uuid]} />
        <button onClick={() => remove(uuid)}>Delete</button>
      </li>
    })

  return (
    <div>
      <h2>Todos</h2>
      <Form 
        schema={todoSchema} 
        callback={handleSubmit}
        resetOnSubmit={true} />
      <ul>
        {content}
      </ul>

      <p>{position.x} - {position.y}</p>
    </div>
  )
};

export default TodoApp;