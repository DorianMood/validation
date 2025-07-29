import { ERROR_DEFAULT } from "./constants";
import { Schema } from "./schema";
import { ValidationOptionsType, SelectOptionType, Maybe } from "./types";

class SelectSchema extends Schema<SelectOptionType> {
  private readonly _selectOptions: SelectOptionType[] = [];

  constructor(
    selectOptions: SelectOptionType[],
    options?: ValidationOptionsType
  ) {
    super();

    this._selectOptions = [...selectOptions];
    this._throw = options?.throw || false;

    this._rules.push({
      isValid: this._type(),
      message: ERROR_DEFAULT.SELECT.TYPE,
    });

    this._rules.push({
      isValid: this._options(),
      message: options?.message ?? ERROR_DEFAULT.SELECT.OPTIONS,
    });
  }

  protected _type() {
    return (value: Maybe<SelectOptionType>) =>
      value == null || ("label" in value && "value" in value);
  }

  protected _options() {
    return (selectOptions: Maybe<SelectOptionType>) =>
      selectOptions == null ||
      this._selectOptions.some(
        (option) =>
          option.value === selectOptions.value &&
          option.label === selectOptions.label
      );
  }
}

/**
 * Создает схему валидации `Select`.
 *
 * @example
 * const schema = select([
 *  label: "hello",
 *  value: "1"
 * ]);
 * schema.isValid({ label: "hello", value: "1" }); // вернет true
 * schema.isValid(null); // вернет true
 * schema.isValid({ label: "lol", value: "1"}); // вернет false
 * @param options Опции валидации.
 * @returns Возвращает объект, который можно чейнить.
 */
function select(
  options: SelectOptionType[],
  validationOptions?: ValidationOptionsType
) {
  return new SelectSchema(options, validationOptions);
}

export { select };
