import { ValidationError, SelectOptionType } from "./types";
import * as validation from ".";

describe("Число", () => {
  it("Min: положительный сценарий", () => {
    const schema = validation.number().min(1);

    expect(schema.isValid(2)).toBe(true);
  });

  it("Min: отрицательный сценарий", () => {
    const schema = validation.number().min(1);

    expect(schema.isValid(0)).toBe(false);
  });

  it("Max: положительный сценарий", () => {
    const schema = validation.number().max(1);

    expect(schema.isValid(2)).toBe(false);
  });

  it("Max: отрицательный сценарий", () => {
    const schema = validation.number().max(1);

    expect(schema.isValid(0)).toBe(true);
  });

  it("Required: положительный сценарий", () => {
    const schema = validation.number().required();

    expect(schema.isValid(1)).toBe(true);
  });

  it("Required: отрицательный сценарий", () => {
    const schema = validation.number().required();

    expect(schema.isValid(null)).toBe(false);
  });

  it("Min: граничные значения", () => {
    const schema = validation.number().min(1).max(2);

    expect(schema.isValid(1)).toBe(true);
    expect(schema.isValid(2)).toBe(true);
  });

  it("Чейнинг", () => {
    const schema = validation.number().required().min(0).max(10);

    expect(schema.isValid(null)).toBe(false);
    expect(schema.isValid(-1)).toBe(false);
    expect(schema.isValid(11)).toBe(false);
    expect(schema.isValid(1)).toBe(true);
  });
});

describe("Строка", () => {
  it("Min: положительный сценарий", () => {
    const schema = validation.string().min(1);

    expect(schema.isValid("12")).toBe(true);
  });

  it("Min: отрицательный сценарий", () => {
    const schema = validation.string().min(1);

    expect(schema.isValid("")).toBe(false);
  });

  it("Max: положительный сценарий", () => {
    const schema = validation.string().max(1);

    expect(schema.isValid("1")).toBe(true);
  });

  it("Max: отрицательный сценарий", () => {
    const schema = validation.string().max(1);

    expect(schema.isValid("12")).toBe(false);
  });

  it("Required: положительный сценарий", () => {
    const schema = validation.string().required();

    expect(schema.isValid("1")).toBe(true);
  });

  it("Required: отрицательный сценарий пустая строка", () => {
    const schema = validation.string().required();

    expect(schema.isValid("")).toBe(false);
  });

  it("Required: отрицательный сценарий", () => {
    const schema = validation.string().required();

    expect(schema.isValid(null)).toBe(false);
  });

  it("Length: положительный сценарий", () => {
    const schema = validation.string().length(2);

    expect(schema.isValid("12")).toBe(true);
  });

  it("Length: отрицательный сценарий", () => {
    const schema = validation.string().length(2);

    expect(schema.isValid("123")).toBe(false);
  });

  it("Match: положительный сценарий", () => {
    const schema = validation.string().match(/^123$/);

    expect(schema.isValid("123")).toBe(true);
  });

  it("Match: отрицательный сценарий", () => {
    const schema = validation.string().match(/^123$/);

    expect(schema.isValid("1234")).toBe(false);
  });

  it("Чейнинг", () => {
    const schema = validation.string().required().min(1).max(10);

    expect(schema.isValid(null)).toBe(false);
    expect(schema.isValid("")).toBe(false);
    expect(schema.isValid("12345678901")).toBe(false);
    expect(schema.isValid("123")).toBe(true);
  });
});

describe("Объект", () => {
  it("Схема", () => {
    const schema = validation.object<object>({
      first: validation.string().required(),
      second: validation.number(),
    });

    expect(schema.isValid({ first: "hello", second: 1 })).toBe(true);
    expect(schema.isValid({ first: "hello", second: "h1" })).toBe(false);
    expect(schema.isValid(null)).toBe(true);
    expect(schema.isValid({ first: "hello" })).toBe(true);
    expect(schema.isValid({ second: 1 })).toBe(false);
    expect(schema.isValid({})).toBe(false);
    expect(schema.isValid({ lol: 123 })).toBe(false);
    // Need to add "strict" validation where the object must match schema exactly.
    expect(schema.isValid({ first: "123", second: 1, lol: 123 })).toBe(true);
  });
});

describe("Массив", () => {
  it("Инициализация", () => {
    const schema = validation.array(validation.number());

    expect(schema.isValid([])).toBe(true);
  });

  it("Длина", () => {
    const schema = validation.array(validation.number()).length(2);

    expect(schema.isValid([1, 2])).toBe(true);
    expect(schema.isValid([1])).toBe(false);
  });

  it("Минимальная длина", () => {
    const schema = validation.array(validation.number()).min(2);

    expect(schema.isValid([1, 2, 3])).toBe(true);
    expect(schema.isValid([1, 2])).toBe(true);
    expect(schema.isValid([1])).toBe(false);
  });

  it("Максимальная длина", () => {
    const schema = validation.array(validation.number()).max(2);

    expect(schema.isValid([1, 2, 3])).toBe(false);
    expect(schema.isValid([1, 2])).toBe(true);
    expect(schema.isValid([1])).toBe(true);
  });

  it("Проверка на вхождение", () => {
    const schema = validation.array(validation.number()).contain([1, 2]);

    expect(schema.isValid([1, 2, 3])).toBe(true);
    expect(schema.isValid([1, 2])).toBe(true);
    expect(schema.isValid([1])).toBe(false);
    expect(schema.isValid([2, 3, 4])).toBe(false);
    expect(schema.isValid([3, 4])).toBe(false);
  });

  it("Проверка схемы элементов", () => {
    const schema = validation.array(validation.number());

    expect(schema.isValid([])).toBe(true);
    expect(schema.isValid([1, 2, 3])).toBe(true);
    expect(schema.isValid([2, 3, "4" as unknown as number])).toBe(false);
  });
});

describe("Select", () => {
  const OPTIONS: SelectOptionType[] = [
    {
      label: "Select",
      value: "select",
    },
    {
      label: "String",
      value: "string",
    },
    {
      label: "Number",
      value: "number",
    },
  ];

  it("Инициализация", () => {
    const schema = validation.select(OPTIONS);

    expect(schema.isValid(null)).toBe(true);
    expect(schema.isValid(undefined)).toBe(true);

    const schemaRequired = schema.required();

    expect(schemaRequired.isValid(null)).toBe(false);
    expect(schemaRequired.isValid(undefined)).toBe(false);
  });

  it("Select вхождение options", () => {
    const schema = validation.select(OPTIONS);

    expect(schema.isValid(OPTIONS[1])).toBe(true);
    expect(schema.isValid({ label: "Not in options", value: "object" })).toBe(
      false,
    );
  });
});

describe("Ошибки валидации", () => {
  it("Number схема возвращает ошибки", () => {
    const schema = validation
      .number({ message: "Must be number" })
      .required({ message: "Is required" });

    expect(schema.validate(123)).toHaveLength(0);
    expect(schema.validate(null)).toHaveLength(1);

    expect(schema.validate(null)[0].message).toBe("Is required");
    expect(schema.validate("hi" as unknown as number)[0].message).toBe(
      "Must be number",
    );
  });

  it("String схема возвращает ошибки", () => {
    const schema = validation
      .string({ message: "Must be string" })
      .min(1, { message: "Must be greater than 1" })
      .required({ message: "Is required" });

    expect(schema.validate("hello")).toHaveLength(0);
    expect(schema.validate(null)).toHaveLength(1);
    expect(schema.validate("")).toHaveLength(2);

    expect(schema.validate(123 as unknown as string)[0].message).toBe(
      "Must be string",
    );

    const schema1 = validation
      .string({ message: "Must be string" })
      .required({ message: "Is required" })
      .min(1, { message: "Must be greater than 1" });

    expect(schema1.validate(null)[0].message).toBe("Is required");
  });

  it("Schema бросает ошибки", () => {
    const schema = validation
      .string({ message: "Must be string", throw: true })
      .min(1, { message: "Must be greater than 1" })
      .required({ message: "Is required" });

    expect(() => schema.validate(null)).toThrowError(ValidationError);
  });
});

describe("Дата", () => {
  it("Min: положительный сценарий", () => {
    const schema = validation.date().min("02-01-2000");

    expect(schema.isValid("03-01-2000")).toBe(true);
  });

  it("Min: отрицательный сценарий", () => {
    const schema = validation.date().min("02-01-2000");

    expect(schema.isValid("01-01-2000")).toBe(false);
  });

  it("Max: положительный сценарий", () => {
    const schema = validation.date().max("02-01-2000");

    expect(schema.isValid("01-01-2000")).toBe(true);
  });

  it("Max: отрицательный сценарий", () => {
    const schema = validation.date().max("01-01-2000");

    expect(schema.isValid("02-01-2000")).toBe(false);
  });

  it("Required: положительный сценарий", () => {
    const schema = validation.date().required();

    expect(schema.isValid("01-01-2000")).toBe(true);
  });

  it("Required: отрицательный сценарий пустая строка", () => {
    const schema = validation.date().required();

    expect(schema.isValid("")).toBe(false);
  });

  it("Required: отрицательный сценарий", () => {
    const schema = validation.date().required();

    expect(schema.isValid(null)).toBe(false);
  });

  it("Чейнинг", () => {
    const schema = validation
      .date()
      .required()
      .min("02-01-2000")
      .max("03-03-2000");

    expect(schema.isValid(null)).toBe(false);
    expect(schema.isValid("")).toBe(false);
    expect(schema.isValid("01-01-2000")).toBe(false);
    expect(schema.isValid("02-01-2000")).toBe(true);
  });
});
