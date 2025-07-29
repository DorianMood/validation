import { ObjectSchema } from "./object";
import { ValidationError } from "./types";

export const getErrorsMap = <TObject extends object>(
  data: TObject,
  validator: ObjectSchema<TObject>
): Record<string, string> => {
  const errors: ValidationError[] = validator.validate(data);

  return errors.reduce<Record<string, string>>((acc, error) => {
    if (!error.path) {
      return acc;
    }

    const path = error.path.startsWith(".") ? error.path.slice(1) : error.path;

    acc[path] = error.message;

    return acc;
  }, {});
};
