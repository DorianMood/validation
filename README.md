# Validation

## Описание

Утилита для валидации данных.

## Основные концепты

### Схема

Схема это набор правил для валидации значения. Схему можно создать при помощи базовых функций:

```js
import { validation } from "@rshbintech.dboul/utils";

const stringSchema = validation.string();
const numberSchema = validation.number();
const boolean = validation.boolean();
const arraySchema = validation.array();
const object = validation.object({
  first: validation.string(),
  second: validation.number(),
});
const selectSchema = validation.select([{ value: "1", label: "hello" }]);
const dateSchema = validation.date();
```

### Чейнинг

Чейнинг это последовательное применение функций-модификаторов к объекту. В этой утилите схемы валидации создаются именно при помощи чейнинга. Это возможно благодаря тому, что большинство методов схемы возвращают саму схему.

Так, ниже мы создаем схему, которой удовлетворят числа, не равные `null` или `undefined`, в промежутке от `0` до `14` включительно:

```js
const numberSchema = validation.number().required().min(0).max(14);
```

## Валидация

В разных случаях нам нужно либо просто понять, подходит ли значение под схему, либо узнать, из-за чего значение не подходит.

За проверку на `null` и `undefined` отвечает метод `required()`, остальные методы валидации для этих значений должны возвращать `true`.

```js
const numberSchema = validation.number().required().min(0).max(14);

// Вернет ошибки валидации (массив строк).
const errors = numberSchema.validate(16);

// Вернет false, так как схема не валидна.
const isValid = numberSchema.isValid(16);
```

## Примеры использования

```js
import { validation } from "@rshbintech.dboul/utils";

const stringSchema = validation.string().required().min(1).max(10);
const numberSchema = validation.number();
const boolean = validation.boolean();
const arraySchema = validation.array().contain([1, 2]);
const object = validation.object({
  first: validation.string(),
  second: validation.number(),
});
const selectSchema = validation.select([{ value: "1", label: "hello" }]);
const dateSchema = validation
  .date()
  .required()
  .min("02-01-2000")
  .max("03-03-2000");

numberSchema.isValid(2); // true
numberSchema.isValid(0); // false

stringSchema.isValid("1"); // true
stringSchema.isValid(""); // false
stringSchema.isValid(null); // false

objectSchema.isValid({ first: "hello", second: 1 }); // true
objectSchema.isValid({ first: "hello", second: "h1" }); // false
objectSchema.isValid(null); // true
objectSchema.isValid({ first: "hello" }); // true
objectSchema.isValid({ second: 1 }); // false
objectSchema.isValid({}); // false
objectSchema.isValid({ lol: 123 }); // false

arraySchema.isValid([1, 2, 3]); // true
arraySchema.isValid([1, 2]); // true
arraySchema.isValid([1]); // false
arraySchema.isValid([2, 3, 4]); // false
arraySchema.isValid([3, 4]); // false

selectSchema.isValid({ value: "lol", label: "lol" }); // false

dateSchema.isValid(null); // false
dateSchema.isValid(""); // false
dateSchema.isValid("01-01-2000"); // false
dateSchema.isValid("02-01-2000"); // true
```

Больше примеров можно найти в тестах.
