
/**
 * Module dependencies.
 */

import { Constraint, Validator } from 'validator.js';
import isPlainObject from 'lodash.isplainobject';
import reduce from 'lodash.reduce';

/**
 * Mask data from constraints.
 */

function maskDataFromConstraints(data, constraints) {
  return reduce(constraints, (result, values, key) => {
    // Skip non existent key.
    if (!data.hasOwnProperty(key)) {
      return result;
    }

    const hasDeeperConstraints = isPlainObject(values);
    const value = data[key];

    // Skip value that is not an object and has deeper constraints.
    if (hasDeeperConstraints && !isPlainObject(value)) {
      return result;
    }

    return {
      ...result,
      [key]: hasDeeperConstraints ? maskDataFromConstraints(value, values) : value
    };
  }, {});
}

/**
 * Create validate function.
 */

export default ValidationFailedError => {
  const validator = new Validator();

  return (data, constraints, { groups, mask = true, throws = true } = {}) => {
    const errors = validator.validate(data, new Constraint(constraints, { deepRequired: true }), groups);

    if (errors === true) {
      return mask ? maskDataFromConstraints(data, constraints) : true;
    }

    if (ValidationFailedError && throws) {
      throw new ValidationFailedError(errors);
    }

    return errors;
  };
};
