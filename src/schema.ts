import { ERROR_DEFAULT } from "./constants";
import {
  ValidationOptionsType,
  ValidationRule,
  ValidateOptions,
  ValidationError,
  Maybe,
} from "./types";

abstract class Schema<T> {
  protected _rules: ValidationRule<T>[] = [];

  protected _throw = false;

  constructor(options?: ValidationOptionsType) {
    this._throw = !!options?.throw;
  }

  /**
   * Задает валидирующую функцию для схемы.
   *
   * @example
   * const isValid = number().validateFunction(
   * (value: number) => value === 1337;
   * ).isValid(1337); // Вернет true
   * @param validateFunction Функция, которая будет использоваться для валидации.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  validateFunction(
    validateFunction: (value?: Maybe<T>) => boolean,
    options?: ValidationOptionsType
  ) {
    this._rules.push({
      isValid: validateFunction,
      message: options?.message ?? ERROR_DEFAULT.SCHEMA.VALIDATE_FUNCTION,
    });

    return this;
  }

  /**
   * Запрещает `null` и `undefined` значения.
   *
   * @example
   * const isValid = number().required().isValid(1337); // Вернет true
   * @example
   * const isValid = number().required().isValid(null); // Вернет false
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  required(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._required(),
      message: options?.message ?? ERROR_DEFAULT.SCHEMA.REQUIRED,
    });

    return this;
  }

  /**
   * Валидирует переданное значение.
   *
   * @example
   * const isValid = number().required().isValid(1337); // Вернет true
   * @example
   * const isValid = number().required().isValid(null); // Вернет false
   * @param value Значение для валидации.
   * @returns Возвращает `true` при успешной валидации или `false` при неуспешной.
   */
  public isValid(value: Maybe<T>) {
    try {
      this.validate(value, { throw: true });
    } catch {
      return false;
    }

    return true;
  }

  /**
   * Валидирует переданное значение.
   *
   * @example
   * const validationErrors = number().min(0).max(3).validate(1); // Вернет []
   * @example
   * const validationErrors = number().min(0).max(3).validate(13); // Вернет [ValidationError({ message: "Должно быть меньше 3", path: undefined })]
   * @param value Значение для валидации.
   * @param options Опции валидации.
   * @returns Возвращает массив ошибок валидации `ValidationError`.
   */
  public validate(
    value: Maybe<T>,
    options?: ValidateOptions
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    this._rules.forEach((rule) => {
      const isValid = rule.isValid(value);

      if (!isValid) {
        const error = new ValidationError(rule.message, options?.path);

        errors.push(error);

        if (this._throw || options?.throw) {
          throw error;
        }
      }
    });

    return errors;
  }

  protected _required() {
    return (value: Maybe<T>) => value != null;
  }

  protected abstract _type(): (value: Maybe<T>) => boolean;
}

export { Schema, ValidationError };
