const schema = {
  title: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Title',
    },
    value: null,
    valid: false,
    validationRules: {
      notEmpty: true,
    },
    touched: false,
  },
  body: {
    elementType: 'textarea',
    elementConfig: {
      placeholder: 'Body',
    },
    value: null,
    valid: false,
    validationRules: {
      notEmpty: true,
    },
    touched: false,
  },
};

export default schema;