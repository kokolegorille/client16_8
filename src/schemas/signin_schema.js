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

  // SAMPLE CONTROLS
  //
  // sampletextarea: {
  //   elementType: 'textarea',
  //   elementConfig: {
  //     rows: 5,
  //     cols: 30,
  //     placeholder: 'sampletextarea',
  //   },
  //   value: null,
  //   valid: false,
  //   validationRules: {
  //     notEmpty: true,
  //   },
  //   touched: false,
  // },
  // sampleselect: {
  //   elementType: 'select',
  //   elementConfig: {
  //     options: [
  //       {value: 'fastest', displayValue: 'Fastest'},
  //       {value: 'cheapest', displayValue: 'Cheapest'},
  //     ],
  //     placeholder: 'sampleselect',
  //   },
  //   value: null,
  //   valid: true,
  //   validationRules: {},
  //   touched: false,
  // },
};

export default schema;