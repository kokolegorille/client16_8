import React, { useState } from 'react';

import validation from '../utils/validation';

const Form = ({
  callback, 
  schema,
  initialState = {}, 
  handleCancel,
}) => {
  // Display label, or not
  const showLabel = false;

  // Create initial state
  const loadState = obj => {
    let theState = Object.assign({}, schema);

    Object.keys(obj)
      .filter(key => obj[key])
      .forEach((key) => {
        theState[key].value = obj[key];
        theState[key].valid = validation(
          obj[key],
          schema[key].validationRules,
        );
        theState[key].touched = true;
      });
    
    return theState;
  };

  const [state, setState] = useState(loadState(initialState));
  const names = Object.keys(schema);

  // Change handler
  const handleChange = (e, name) => {
    e.persist();
    setState(previousState => {
      const value = e.target.value ? e.target.value : '';

      return {
        ...previousState,
        [name]: {
          ...previousState[name],
          value,
          valid: validation(
            value,
            previousState[name].validationRules,
          ),
          touched: true,
        },
      };
    });
  };

  // Create a field based on schema metadata
  const renderField = name => {
    const { 
      elementType, 
      elementConfig,
    } = schema[name];
    
    let inputClasses = ['form-control'];

    const { valid, touched, value } = state[name];

    // Set bootstrap form style
    if (!valid && touched) inputClasses.push('error is-invalid');
    if (valid && touched) inputClasses.push('is-valid');

    let element;
    let stateValue = value || '';
    let className = inputClasses.join(' ');

    switch(elementType) {
      // case 'select':
      // case 'textarea':
      // case 'checkbox':
      // case 'radiobox':

      case 'input':
      default:
        element = (
          <input 
            name={name}
            value={stateValue}
            className={className}
            onChange={e => handleChange(e, name)}
            {...elementConfig}
          />
        );
    }
    return (
      <div key={name} className='form-group'>
        {
          showLabel &&
          <label htmlFor={name}>{name}</label>
        }
        {element}
      </div>
    );
  };

  // Extract values only from state
  const sanitizeState = state => (
    names.reduce((acc, key) => {
      acc[key] = state[key].value;
      return acc;
    }, {})
  );

  // Returns true if all fields are valid in the form
  const validateForm = () => names.map(name => state[name].valid).every(v => v);

  // Build fields
  const fields = names.map(name => renderField(name));
  
  // console.log(state);

  return (
    <form>
      {fields}
      <button 
        disabled={!validateForm()}
        onClick={e => callback(e, sanitizeState(state))}
        className="btn btn-primary" >
        Submit
      </button>
      {
        handleCancel &&
        <button 
          onClick={handleCancel}
          className="btn btn-secondary" >
          Cancel
        </button>
      }
    </form>
  )
};

export default Form;