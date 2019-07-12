import React from 'react';

const Button = ({ label, onClick, ...otherProps }) => (
  <button
    onClick={onClick}
    {...otherProps}
  >
    {label}
  </button>
);

export default Button;