import { ERROR_DEFAULT, REGEXP } from "./constants";
import { SequenceSchema } from "./sequence";
import { Maybe, ValidationOptionsType } from "./types";

class StringSchema extends SequenceSchema<string> {
  constructor(options?: ValidationOptionsType) {
    super(options);
    this._rules.push({
      isValid: this._type(),
      message: options?.message ?? ERROR_DEFAULT.STRING.TYPE,
    });
  }

  /**
   * Проверяет на соответствие регулярному выражению.
   *
   * @example
   * const isValid = string().match(/\d+/).isValid("123"); // вернет true
   * @example
   * const isValid = string().match().isValid("lol"); // вернет false
   *
   * @param pattern Регулярное выражение.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  match(pattern: RegExp, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._match(pattern),
      message:
        options?.message ??
        ERROR_DEFAULT.STRING.MATCH.replace("{0}", `${pattern}`),
    });

    return this;
  }

  /**
   * Проверяет, является ли email.
   *
   * @example
   * const isValid = string().email().isValid("example@gmail.com"); // вернет true
   * @example
   * const isValid = string().email().isValid("lol"); // вернет false
   *
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  email(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._match(REGEXP.EMAIL),
      message: options?.message ?? ERROR_DEFAULT.STRING.EMAIL,
    });

    return this;
  }

  /**
   * Проверяет, является ли телефоном.
   *
   * @example
   * const isValid = string().phone().isValid("88005553535"); // вернет true
   * @example
   * const isValid = string().phone().isValid("+78005553535"); // вернет true
   * @example
   * const isValid = string().phone().isValid("lol"); // вернет false
   *
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  phone(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._match(REGEXP.PHONE),
      message: options?.message ?? ERROR_DEFAULT.STRING.PHONE,
    });

    return this;
  }

  /**
   * Задает строке проверку на пустоту (количество элементов больше 0).
   *
   * @example
   * const isValid = string().required().isValid("123"); // вернет true
   * @example
   * const isValid = string().required().isValid(""); // вернет false
   *
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  required(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._required(),
      message: options?.message ?? ERROR_DEFAULT.STRING.REQUIRED,
    });

    return this;
  }

  /**
   * Задает строке проверку на наличие непробельных символов.
   *
   * @example
   * const isValid = string().notEmpty().isValid("abc"); // вернет true
   * @example
   * const isValid = string().notEmpty().isValid(" "); // вернет false
   *
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  notEmpty(options?: ValidationOptionsType) {
    this._rules.push({
      isValid: (value: Maybe<string>) =>
        value == null || this._required()(value.trim()),
      message: options?.message ?? ERROR_DEFAULT.STRING.REQUIRED,
    });

    return this;
  }

  protected _type() {
    return (value: Maybe<string>) => value == null || typeof value === "string";
  }

  private _match(pattern: RegExp) {
    return (value: Maybe<string>) => value == null || pattern.test(value);
  }
}

function string(options?: ValidationOptionsType) {
  return new StringSchema(options);
}

export { string };
