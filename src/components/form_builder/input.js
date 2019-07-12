import React from 'react';

const Input = ({
  inputType, label, reffunc, valid, touched, noWrapper, ...otherProps
}) => {
  let inputElement;

  const inputClasses = ['input-element'];

  if (!valid && touched) {
    inputClasses.push('error');
  }

  switch (inputType) {
    case 'select': {
      // Extract options property
      const { options, ...selectProps } = otherProps;
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          ref={reffunc}
          {...selectProps}
        >
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
    }
    case 'textarea': {
      inputElement = (<textarea
        className={inputClasses.join(' ')}
        ref={reffunc}
        {...otherProps}
      />);
      break;
    }
    case 'input':
    default: {
      inputElement = (<input
        className={inputClasses.join(' ')}
        ref={reffunc}
        {...otherProps}
      />);
    }
  }

  if (noWrapper) {
    return inputElement;
  }

  return (
    <div className="input">
      {
        label &&
        <label 
          htmlFor={otherProps.id}
          className="label">
          {label}
        </label>
      }
      {inputElement}
    </div>
  );
}

export default Input;