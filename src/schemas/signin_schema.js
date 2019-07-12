const schema = {
  name: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Name',
    },
    value: null,
    valid: false,
    validationRules: {
      notEmpty: true,
    },
    touched: false,
  },
  password: {
    elementType: 'input',
    elementConfig: {
      type: 'password',
      placeholder: 'Password',
    },
    value: null,
    valid: false,
    validationRules: {
      minLength: 6,
    },
    touched: false,
  },
};

export default schema;