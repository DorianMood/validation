import { ERROR_DEFAULT } from "./constants";
import { Schema, ValidationError } from "./schema";
import { ValidationOptionsType, ValidateOptions, Maybe } from "./types";

type ObjectShape<TObject extends object> = {
  [key in keyof TObject]?: Schema<TObject[key]>;
};

class ObjectSchema<TObject extends object> extends Schema<TObject> {
  private readonly _childrenSchema: ObjectShape<TObject> = {};

  constructor(schema: ObjectShape<TObject>, options?: ValidationOptionsType) {
    super();
    this._rules.push({
      isValid: this._type(),
      message: ERROR_DEFAULT.OBJECT.TYPE,
    });

    this._childrenSchema = { ...schema };
    this._throw = !!options?.throw;
  }

  /**
   * Валидирует переданный объект.
   *
   * @example
   * const validationErrors = object({
   *  first: string().required(),
   *  second: number()
   * }).validate({
   *  first: "hello",
   *  second: 123
   * }); // Вернет []
   * @example
   * const validationErrors = object({
   *  first: string().required(),
   *  second: number()
   * }).validate({
   *  second: 123
   * }); // Вернет [ValidationError({ message: "Обязательно для заполнения", path: ".first" })]
   * @param options Опции валидации.
   * @returns Возвращает массив ошибок валидации `ValidationError`.
   */
  public validate(
    value: Maybe<TObject>,
    options?: ValidateOptions
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Валидируем сам объект
    errors.push(...super.validate(value, options));

    // Валидируем поля объекта по полученной в конструкторе схеме
    if (value) {
      for (const key in this._childrenSchema) {
        const validator = this._childrenSchema[key];

        // Заглушка для warning'а тайпскрипта
        if (!validator) {
          return errors;
        }

        const validationResult = validator.validate(value[key], {
          ...options,
          path: `${options?.path ?? ""}.${key}`,
        });

        errors.push(...validationResult);

        if (validationResult.length) {
          if (this._throw || options?.throw) {
            throw new ValidationError(
              `Validation for key "${key}" failed with value "${value[key]}".`,
              options?.path
            );
          }
        }
      }
    }

    return errors;
  }

  /**
   * @example
   * const schemaKeys = object({
   *  first: string().required(),
   *  second: number()
   * }).keys(); // Вернет ["first", "second"]
   * @returns Возвращает ключи текущей схемы.
   */
  public keys(): Array<keyof TObject> {
    return Object.keys(this._childrenSchema) as Array<keyof TObject>;
  }

  protected _type() {
    return (value: Maybe<object>) => value == null || typeof value === "object";
  }
}

/**
 * Создает сложную схему валидации, поддерживающую вложенность.
 *
 * @example
 * const schema = object({
 *  first: string().required(),
 *  second: number()
 * });
 * schema.isValid({ first: "hello", second: 1 }); // вернет true
 * schema.isValid({ first: "hello", second: "hi" }); // вернет false
 * schema.isValid({}); // вернет false
 * schema.isValid(null); // вернет true
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function object<TObject extends object>(schema: ObjectShape<TObject>) {
  return new ObjectSchema(schema);
}

export { ObjectSchema, object };
