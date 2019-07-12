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
  email: {
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'Email',
    },
    value: null,
    valid: false,
    validationRules: {
      isEmail: true,
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