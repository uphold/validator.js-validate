
/**
 * Module dependencies.
 */

import { Assert as is } from 'validator.js';
import createValidateFunction from '../src';

/**
 * Test `validate`.
 */

describe('.validate()', () => {
  describe('with no arguments', () => {
    const validate = createValidateFunction();

    it('should return violations if given `data` is invalid against given `constraint`', () => {
      const errors = validate({}, { foo: is.required() });

      expect(Object.keys(errors)).toEqual(['foo']);
      expect(errors.foo.show().assert).toBe('HaveProperty');
    });

    it('should validate given `constraint` with `deepRequired` option', () => {
      const errors = validate({}, { foo: { bar: is.required() } });

      expect(Object.keys(errors)).toEqual(['foo']);
      expect(errors.foo.show().assert).toBe('HaveProperty');
    });

    it('should returned given `data` masked with given `constraint` keys', () => {
      const data = {
        bar: {
          biz: {},
          buz: {}
        },
        foo: {},
        qax: 'qex',
        qux: {}
      };

      const constraint = {
        bar: {
          biz: is.required()
        },
        foo: is.required(),
        qax: {
          qex: is.notBlank()
        },
        qix: is.notBlank()
      };

      expect(validate(data, constraint)).toEqual({
        bar: {
          biz: {}
        },
        foo: {}
      });
    });

    it('should mask collections', () => {
      const data = [{
        bar: ['biz'],
        baz: [{
          bez: 'buz',
          qux: 'qix'
        }],
        foo: 'baz',
        qox: 'qux'
      }];

      const constraint = is.collection({
        bar: is.collection(is.notBlank()),
        baz: is.collection({
          bez: is.notBlank()
        }),
        foo: is.required()
      });

      expect(validate(data, constraint)).toEqual([{
        bar: ['biz'],
        baz: [{
          bez: 'buz'
        }],
        foo: 'baz'
      }]);
    });

    it('should return `true` if `mask` option is given as `false`', () => {
      expect(validate({ foo: {} }, { foo: is.required() }, { mask: false })).toBe(true);
    });

    it('should validate against given `groups` option', () => {
      const data = { foo: 'bar' };
      const constraint = {
        foo: [
          is('bar').equalTo('bar'),
          is('biz').equalTo('biz')
        ]
      };

      const errors = validate(data, constraint, { groups: 'biz' });

      expect(validate(data, constraint, { groups: 'bar' })).toEqual(data);
      expect(errors.foo[0].show().assert).toBe('EqualTo');
    });
  });

  describe('when an error class is provided', () => {
    class ValidationFailedError {
      constructor(errors) {
        this.errors = errors;
      }
    }

    const validate = createValidateFunction(ValidationFailedError);

    it('should throw provided error instance if given `data` is invalid against given `constraint`', () => {
      try {
        validate({}, { foo: is.required() });

        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationFailedError);
        expect(e.errors.foo.show().assert).toBe('HaveProperty');
      }
    });

    it('should return violations if `throws` option is given as `false`', () => {
      const errors = validate({}, { foo: is.required() }, { throws: false });

      expect(Object.keys(errors)).toEqual(['foo']);
      expect(errors.foo.show().assert).toBe('HaveProperty');
    });
  });
});
