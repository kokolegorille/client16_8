// https://www.w3resource.com/javascript/form/phone-no-validation.php
const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const phoneNumberValidator = val => phoneNumberRegex.test(val);
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const emailValidator = val => emailRegex.test(val);
const minLengthValidator = (val, minLength) => val.length >= minLength;
const maxLengthValidator = (val, maxLength) => val.length <= maxLength;
const isLengthValidator = (val, valLength) => val.length === valLength;
const notEmptyValidator = val => val.trim() !== '';

/* eslint-disable no-restricted-syntax */
const validation = (val, rules) => {
  let isValid = true;
  // error The body of a for-in should be wrapped in an if statement
  // to filter unwanted properties from the prototype
  for (const rule in rules) {
    if ({}.hasOwnProperty.call(rules, rule)) {
      switch (rule) {
        case 'isPhoneNumber':
          isValid = isValid && phoneNumberValidator(val);
          break;
        case 'isEmail':
          isValid = isValid && emailValidator(val);
          break;
        case 'minLength':
          isValid = isValid && minLengthValidator(val, rules[rule]);
          break;
        case 'maxLength':
          isValid = isValid && maxLengthValidator(val, rules[rule]);
          break;
        case 'isLength':
          isValid = isValid && isLengthValidator(val, rules[rule]);
          break;
        case 'notEmpty':
          isValid = isValid && notEmptyValidator(val);
          break;
        default:
          isValid = true;
      }
    }
  }

  return isValid;
};
/* eslint-enable no-restricted-syntax */

export default validation;