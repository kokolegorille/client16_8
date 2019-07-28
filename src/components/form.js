import React, { useState, useRef } from 'react';

import validation from '../utils/validation';

const Form = ({
  callback, 
  schema,
  initialState = {}, 
  handleCancel,
  // Reset the form on submit?
  resetOnSubmit = false,
}) => {
  // Display label, or not
  const showLabel = false;

  // The ref of the first input
  // It will be used on form submit to set focus on its
  // When resetOnSubmit is true
  const firstRef = useRef();

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
  const renderField = (name, first = false) => {
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

    let calculatedProps = {
      className,
      autoFocus: first
    };
    
    if (first) calculatedProps = {...calculatedProps, ref: firstRef};

    switch(elementType) {
      case 'select':
        const { options, ...selectProps } = elementConfig;
        element = (
          <select
            name={name}
            {...calculatedProps}
            {...selectProps} >
            {
              options.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  selected={option.selected}
                >
                  {option.displayValue}
                </option>
              ))
            }
          </select>
        );
        break;
      case 'textarea':
        element = (
          <textarea 
            name={name}
            value={stateValue}
            {...calculatedProps}
            onChange={e => handleChange(e, name)}
            {...elementConfig} />
        );
        break;
      
      // TODO:
      // case 'checkbox':
      // case 'radiobox':

      case 'input':
      default:
        element = (
          <input 
            name={name}
            value={stateValue}
            {...calculatedProps}
            onChange={e => handleChange(e, name)}
            {...elementConfig} />
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
  const fields = names.map((name, index) => renderField(name, index === 0));

  const reset = () => setState(loadState(initialState));
  
  // console.log(state);

  return (
    <form>
      {fields}
      <button 
        disabled={!validateForm()}
        onClick={e => {
          e.preventDefault();
          callback(sanitizeState(state));

          if (resetOnSubmit) {
            // reset the form and focus on first input
            reset();
            firstRef.current.focus();
          };
        }}
        className="btn btn-primary" >
        Submit
      </button>
      {
        handleCancel &&
        <button 
          onClick={e => {
            e.preventDefault();
            handleCancel();
          }}
          className="btn btn-secondary" >
          Cancel
        </button>
      }
    </form>
  )
};

export default Form;