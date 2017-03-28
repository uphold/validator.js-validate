# validator.js-validate

Opinionated object validation function based on [validator.js](https://github.com/guillaumepotier/validator.js).

## Status

[![npm version][npm-image]][npm-url] ![node version][node-image] [![build status][travis-image]][travis-url]

## Installation

Install the package via `yarn`:

```sh
$ yarn add validator.js-validate
```

or via `npm`:

```sh
$ npm install validator.js-validate --save
```

## Usage

### Create validate function

This module exports a function that creates a validate function, for instance:

```js
import createValidateFunction from 'validator.js-validate';

const validate = createValidateFunction();
```

The created validate function works just like [validating an object](https://github.com/guillaumepotier/validator.js#validate-an-object), but replaces the last `groups` argument with an options object:

```
validate(data[Object], constraint[Object|Constraint], options[Object])
```

### Options

#### `mask` (Default: `true`)

Returns given data masked with given constraint keys:

```js
const data = { foo: 'bar', qux: 'qix' };
const constraint = { foo: is.equalTo('bar') };

console.log(validate(data, constraint));
// { foo: 'bar' }

console.log(validate(data, constraint, { mask: false }));
// true
```

#### `throws` (Default: `true`)

Throws a new error when validation fails. To enable this option you must pass an error class when creating the validate function as argument.

This error constructor should be prepared to receive violations as argument, for example:

```js
import StandardError from 'standard-error';
import createValidateFunction from 'validator.js-validate';

class ValidationFailedError extends StandardError {
  constructor(errors) {
    super({ errors });
  }
}

const validate = createValidateFunction(ValidationFailedError);
const data = { foo: 'bar' };
const constraint = { foo: is.equalTo('biz') };

try {
  validate(data, constraint);
} catch (e) {
  console.log(e);
  // ValidationFailedError {
  //   errors: {
  //     foo: [{
  //       __class__: 'Violation',
  //       assert: {
  //         __class__: 'EqualTo',
  //         ...
  //       }
  //     }]
  //   }
  // }
  }
}

console.log(validate(data, constraint, { throws: false }));
// {
//   foo: [{
//     __class__: 'Violation',
//     assert: {
//       __class__: 'EqualTo',
//       ...
//     }
//   }]
// }
```

#### `groups`

Use this option to validate with [validation groups](https://github.com/guillaumepotier/validator.js#validation-groups):

```js
const data = { foo: 'bar' };
const constraint = { foo: [is('bar').EqualTo('bar'), is('biz').equalTo('biz')] };

console.log(validate(data, constraint, { groups: 'biz' }));
// {
//   foo: [{
//     __class__: 'Violation',
//     assert: {
//       __class__: 'EqualTo',
//       ...
//     }
//   }]
// }

console.log(validate(data, constraint, { groups: 'bar' }));
// { foo: 'bar' }
```

## Test suite

Use the `test` script to run the test suite:

```sh
$ yarn test
```

To test check coverage use the `cover` script:

```sh
$ yarn cover
```

A full coverage report will be generated on the *coverage* folder.

## Release

```sh
$ yarn release [<version> | major | minor | patch]
```

## License

[MIT](/LICENSE)

[node-image]: https://img.shields.io/node/v/validator.js-validate.svg?style=flat-square
[npm-image]: https://img.shields.io/npm/v/validator.js-validate.svg?style=flat-square
[npm-url]: https://npmjs.org/package/validator.js-validate
[travis-image]: https://img.shields.io/travis/uphold/validator.js-validate/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/uphold/validator.js-validate
