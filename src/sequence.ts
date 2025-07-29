import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { Maybe, ValidationOptionsType } from "./types";

abstract class SequenceSchema<
  T extends Array<unknown> | string
> extends Schema<T> {
  /**
   * Задает последовательности минимальный размер.
   *
   * @example
   * const isValid = array().min(3).isValid([1, 2, 3]); // вернет true
   * @example
   * const isValid = array().min(3).isValid([]); // вернет false
   * @example
   * const isValid = string().min(3).isValid("123"); // вернет true
   * @example
   * const isValid = string().min(3).isValid(""); // вернет false
   *
   * @param min Минимальная длина последовательности.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  min(min: number, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._min(min),
      message:
        options?.message ??
        ERROR_DEFAULT.SEQUENCE.MIN.replace("{0}", min.toString()),
    });

    return this;
  }

  /**
   * Задает последовательности максимальный размер.
   *
   * @example
   * const isValid = array().max(3).isValid([1, 2, 3]); // вернет false
   * @example
   * const isValid = array().max(3).isValid([]); // вернет true
   * @example
   * const isValid = string().max(3).isValid("123"); // вернет false
   * @example
   * const isValid = string().max(3).isValid(""); // вернет true
   *
   * @param max Максимальная длина последовательности.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  max(max: number, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._max(max),
      message:
        options?.message ??
        ERROR_DEFAULT.SEQUENCE.MAX.replace("{0}", max.toString()),
    });

    return this;
  }

  /**
   * Задает последовательности длину.
   *
   * @example
   * const isValid = array().length(3).isValid([1, 2, 3]); // вернет true
   * @example
   * const isValid = array().length(3).isValid([]); // вернет false
   * @example
   * const isValid = string().length(3).isValid("123"); // вернет true
   * @example
   * const isValid = string().length(3).isValid(""); // вернет false
   *
   * @param length Длина последовательности.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  length(length: number, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._length(length),
      message:
        options?.message ??
        ERROR_DEFAULT.SEQUENCE.LENGTH.replace("{0}", length.toString()),
    });

    return this;
  }

  /**
   * Задает последовательности проверку на пустоту (количество элементов больше 0).
   *
   * @example
   * const isValid = array().required().isValid([1, 2, 3]); // вернет true
   * @example
   * const isValid = array().required().isValid([]); // вернет false
   * @example
   * const isValid = string().required().isValid("123"); // вернет true
   * @example
   * const isValid = string().required().isValid(""); // вернет false
   *
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  required(options?: ValidationOptionsType) {
    super.required();
    this._rules.push({
      isValid: this._required(),
      message: options?.message ?? ERROR_DEFAULT.SEQUENCE.REQUIRED,
    });

    return this;
  }

  protected _required() {
    return (value: Maybe<T>): value is T => value != null && value?.length > 0;
  }

  private _min(min: number) {
    return (value: Maybe<T>) => value == null || value?.length >= min;
  }

  private _max(max: number) {
    return (value: Maybe<T>) => value == null || value?.length <= max;
  }

  private _length(length: number) {
    return (value: Maybe<T>) => value == null || value?.length === length;
  }
}

export { SequenceSchema };
