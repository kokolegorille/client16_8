import React from 'react';

import Input from './input';
import Button from './button';
import validate from './validation';

const Form = () => {
  return (
    <form>
      <Input />
      <Button 
        disabled={false} 
        label="BUTTON" 
        onClick={() => console.log("CLICKED!")} />
    </form>
  )
};

export default Form;