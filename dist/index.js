'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
/**
 * Module dependencies.
 */

var _validator = require('validator.js');

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.reduce');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Mask data from constraints.
 */

function maskDataFromConstraints(data, constraints) {
  return (0, _lodash4.default)(constraints, (result, values, key) => {
    if (Array.isArray(data)) {
      const nodes = constraints.constraint.nodes;


      return data.map(element => {
        return nodes ? maskDataFromConstraints(element, nodes) : element;
      });
    }

    // Skip non existent key.
    if (!data.hasOwnProperty(key)) {
      return result;
    }

    // eslint-disable-next-line no-underscore-dangle
    const hasDeeperConstraints = (0, _lodash2.default)(values) || values.__class__ === 'Collection';
    const value = data[key];

    // Skip value that is not an object or array and has deeper constraints.
    if (hasDeeperConstraints && !(0, _lodash2.default)(value) && !Array.isArray(value)) {
      return result;
    }

    return _extends({}, result, {
      [key]: hasDeeperConstraints ? maskDataFromConstraints(value, values) : value
    });
  }, {});
}

/**
 * Create validate function.
 */

exports.default = ValidationFailedError => {
  const validator = new _validator.Validator();

  return function (data, constraints) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$deepRequired = _ref.deepRequired;

    let deepRequired = _ref$deepRequired === undefined ? true : _ref$deepRequired,
        groups = _ref.groups;
    var _ref$mask = _ref.mask;
    let mask = _ref$mask === undefined ? true : _ref$mask;
    var _ref$throws = _ref.throws;
    let throws = _ref$throws === undefined ? true : _ref$throws;

    const constraint = constraints instanceof _validator.Assert ? constraints : new _validator.Constraint(constraints, { deepRequired: deepRequired });
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

module.exports = exports['default'];