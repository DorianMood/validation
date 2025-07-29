import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { SequenceSchema } from "./sequence";
import {
  Maybe,
  ValidateOptions,
  ValidationError,
  ValidationOptionsType,
} from "./types";

class ArraySchema<T> extends SequenceSchema<T[]> {
  private readonly _elementSchema: Schema<T>;

  constructor(schema: Schema<T>, options?: ValidationOptionsType) {
    super();
    this._rules.push({
      isValid: this._type(),
      message: ERROR_DEFAULT.ARRAY.TYPE,
    });

    this._elementSchema = schema;
    this._throw = !!options?.throw;
  }

  /**
   * Валидирует переданный массив.
   *
   * @example
   * const validationErrors = array({
   *  first: string().required(),
   *  second: number()
   * }).validate([{
   *  first: "hello",
   *  second: 123
   * }]); // Вернет []
   * @example
   * const validationErrors = array({
   *  first: string().required(),
   *  second: number()
   * }).validate([{
   *  second: 123
   * }]); // Вернет [ValidationError({ message: "Обязательно для заполнения", path: ".0.first" })]
   * @param options Опции валидации.
   * @returns Возвращает массив ошибок валидации `ValidationError`.
   */
  public validate(
    value: Maybe<T[]>,
    options?: ValidateOptions,
  ): ValidationError[] {
    const valueToValidate = value ?? [];

    const errors: ValidationError[] = [];

    // Валидируем сам массив
    errors.push(...super.validate(value, options));

    // Валидируем элементы массива по полученной в конструкторе схеме
    valueToValidate.forEach((element, i) => {
      const validationResult = this._elementSchema.validate(element, {
        ...options,
        path: `${options?.path ?? ""}.${i}`,
      });

      errors.push(...validationResult);

      if (validationResult.length) {
        if (this._throw || options?.throw) {
          throw new ValidationError(
            `Validation for index "${i}" failed with value "${element}".`,
            options?.path,
          );
        }
      }
    });

    return errors;
  }

  /**
   * Проверяет элементы на вхождение в массив.
   *
   * @example
   * const isValid = array().contain([1, 2]).isValid([1, 2, 3]); // вернет true
   *
   * @param items Элементы, которые нужно проверить на вхождение.
   * @param options Опции валидации.
   * @returns Возвращает объект, который можно чейнить.
   */
  contain(items: Array<T>, options?: ValidationOptionsType) {
    this._rules.push({
      isValid: this._contain(items),
      message:
        options?.message ??
        ERROR_DEFAULT.ARRAY.CONTAIN.replace("{0}", `[${items.join(", ")}]`),
    });

    return this;
  }

  protected _type() {
    return (value: Maybe<T[]>) => value == null || Array.isArray(value);
  }

  private _contain(items: T[]) {
    return (value: Maybe<T[]>) =>
      value == null || new Set([...items, ...value]).size === value.length;
  }
}

/**
 * Создает схему валидации для массива.
 *
 * @example
 * const isValid = array().isValid([]); // вернет true
 * @param element Схема валидации элементов массива.
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function array<T>(element: Schema<T>, options?: ValidationOptionsType) {
  return new ArraySchema<T>(element, options);
}

export { array };
