import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { DateValue, Maybe, ValidationOptionsType } from "./types";

class DateSchema extends Schema<string> {
  constructor(options?: ValidationOptionsType) {
    super();
    this._rules.push({
      isValid: this._type(),
      message: options?.message ?? ERROR_DEFAULT.DATE.TYPE,
    });
  }

  /**
   * Задает нижний порог для даты.
   *
   * @example
   * const isValid = date().max("02-01-2000").isValid("01-01-2000"); // Вернет true
   * @example
   * const isValid = date().max("02-01-2000").isValid("03-01-2000"); // Вернет false
   * @param min дата в формате DD-MM-YYYY или Date
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  min(min: string | Date, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._min(this._cast(min)),
      message:
        options?.message ??
        ERROR_DEFAULT.DATE.MIN.replace("{0}", min.toString()),
    });

    return this;
  }

  /**
   * Задает верхний порог для даты.
   *
   * @example
   * const isValid = date().max("02-01-2000").isValid("01-01-2000"); // Вернет true
   * @example
   * const isValid = date().max("02-01-2000").isValid("03-01-2000"); // Вернет false
   * @param max дата в формате DD-MM-YYYY или Date
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  max(max: string | Date, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._max(this._cast(max)),
      message:
        options?.message ??
        ERROR_DEFAULT.DATE.MAX.replace("{0}", max.toString()),
    });

    return this;
  }

  protected _type() {
    return (value: Maybe<DateValue>) => {
      if (value == null) {
        return true;
      }

      try {
        this._cast(value);

        return true;
      } catch {
        return false;
      }
    };
  }

  private _min(min: Date) {
    return (value: Maybe<string>) => value == null || this._cast(value) >= min;
  }

  private _max(max: Date) {
    return (value: Maybe<string>) => value == null || this._cast(value) <= max;
  }

  private _cast(value: DateValue): Date {
    if (value instanceof Date) {
      return value;
    }

    switch (typeof value) {
      case "number": {
        return new Date(value);
      }

      case "string": {
        try {
          const parsedDate = new Date(value);

          if (isNaN(parsedDate.valueOf())) {
            throw new TypeError(value);
          }

          return parsedDate;
        } catch (e) {
          const parsed =
            Date.parse(value) ||
            Date.parse(value.split("-").reverse().join("-"));

          return new Date(parsed);
        }
      }

      default: {
        throw new TypeError(value);
      }
    }
  }

  protected _required() {
    return (value: Maybe<string>): value is string =>
      value != null && value.length > 0;
  }
}

/**
 * Создает схему валидации для значения типа даты.
 * Можно использовать как для значений типа `Date`,
 * так и для любых строковых значений, которые возможно привести к `Date`.
 *
 * @example
 * const isValid = date().isValid(true); // вернет true
 * @example
 * const isValid = date().isValid("hello"); // вернет false
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function date(options?: ValidationOptionsType) {
  return new DateSchema(options);
}

export { date };
