
/**
 * Module dependencies.
 */

import { Assert, Constraint, Validator } from 'validator.js';
import isPlainObject from 'lodash.isplainobject';
import reduce from 'lodash.reduce';

/**
 * Mask data from constraints.
 */

function maskDataFromConstraints(data, constraints) {
  return reduce(constraints, (result, values, key) => {
    if (Array.isArray(data)) {
      const { nodes } = constraints.constraint;

      return data.map(element => {
        return nodes ? maskDataFromConstraints(element, nodes) : element;
      });
    }

    // Skip non existent key.
    if (!data.hasOwnProperty(key)) {
      return result;
    }

    // eslint-disable-next-line no-underscore-dangle
    const hasDeeperConstraints = isPlainObject(values) || values.__class__ === 'Collection';
    const value = data[key];

    // Skip value that is not an object or array and has deeper constraints.
    if (hasDeeperConstraints && !isPlainObject(value) && !Array.isArray(value)) {
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
    const constraint = constraints instanceof Assert ? constraints : new Constraint(constraints, { deepRequired: true });
    const errors = validator.validate(data, constraint, groups);

    if (errors === true) {
      return mask ? maskDataFromConstraints(data, constraints) : true;
    }

    if (ValidationFailedError && throws) {
      throw new ValidationFailedError(errors);
    }

    return errors;
  };
};
