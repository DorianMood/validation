import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { Maybe, ValidationOptionsType } from "./types";

class NumberSchema extends Schema<number> {
  constructor(options?: ValidationOptionsType) {
    super();
    this._rules.push({
      isValid: this._type(),
      message: options?.message ?? ERROR_DEFAULT.NUMBER.TYPE,
    });
  }

  /**
   * Задает нижний порог для числа.
   *
   * @example
   * const isValid = number().min(10).isValid(10); // Вернет true
   * @example
   * const isValid = number().min(10).isValid(9); // Вернет false
   * @param min нижняя граница (включительно).
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  min(min: number, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._min(min),
      message:
        options?.message ??
        ERROR_DEFAULT.NUMBER.MIN.replace("{0}", min.toString()),
    });

    return this;
  }

  /**
   * Задает верхний порог для числа.
   *
   * @example
   * const isValid = number().max(10).isValid(10); // Вернет true
   * @example
   * const isValid = number().max(10).isValid(11); // Вернет false
   * @param max верхняя граница (включительно).
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  max(max: number, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._max(max),
      message:
        options?.message ??
        ERROR_DEFAULT.NUMBER.MAX.replace("{0}", max.toString()),
    });

    return this;
  }

  /**
   * Число должно быть положительным (больше нуля).
   *
   * @example
   * const isValid = number().positive().isValid(10); // Вернет true
   * @example
   * const isValid = number().positive().isValid(0); // Вернет false
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  positive(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._positive(),
      message: options?.message ?? ERROR_DEFAULT.NUMBER.POSITIVE,
    });

    return this;
  }

  /**
   * Число должно быть отрицательным (меньше нуля).
   *
   * @example
   * const isValid = number().negative().isValid(-1); // Вернет true
   * @example
   * const isValid = number().negative().isValid(0); // Вернет false
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  negative(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._negative(),
      message: options?.message ?? ERROR_DEFAULT.NUMBER.NEGATIVE,
    });

    return this;
  }

  /**
   * Число должно быть целым.
   *
   * @example
   * const isValid = number().integer().isValid(-1); // Вернет true
   * @example
   * const isValid = number().integer().isValid(0.5); // Вернет false
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  integer(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._integer(),
      message: options?.message ?? ERROR_DEFAULT.NUMBER.INTEGER,
    });

    return this;
  }

  protected _type() {
    return (value: Maybe<number>) => value == null || typeof value === "number";
  }

  private _min(min: number) {
    return (value: Maybe<number>) => value == null || value >= min;
  }

  private _max(max: number) {
    return (value: Maybe<number>) => value == null || value <= max;
  }

  private _positive() {
    return (value: Maybe<number>) => value == null || value > 0;
  }

  private _negative() {
    return (value: Maybe<number>) => value == null || value < 0;
  }

  private _integer() {
    return (value: Maybe<number>) => value == null || Number.isInteger(value);
  }
}

/**
 * Создает схему валидации для значения типа `number`.
 *
 * @example
 * const isValid = number().isValid(1); // вернет true
 * @example
 * const isValid = number().isValid("hello"); // вернет false
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function number(options?: ValidationOptionsType) {
  return new NumberSchema(options);
}

export { number };
