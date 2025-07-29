import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { Maybe, ValidationOptionsType } from "./types";

class BooleanSchema extends Schema<boolean> {
  constructor(options?: ValidationOptionsType) {
    super();
    this._rules.push({
      isValid: this._type(),
      message: options?.message ?? ERROR_DEFAULT.BOOLEAN.TYPE,
    });
  }

  protected _type() {
    return (value: Maybe<boolean>) =>
      value == null || typeof value === "boolean";
  }
}

/**
 * Создает схему валидации для `boolean` значения.
 *
 * @example
 * const isValid = boolean().isValid(false); // вернет true
 * @example
 * const isValid = boolean().isValid("hello"); // вернет false
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function boolean(options?: ValidationOptionsType) {
  return new BooleanSchema(options);
}

export { boolean };
