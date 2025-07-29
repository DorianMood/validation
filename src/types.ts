import { ReactNode } from "react";

// Правило валидации
export type ValidationRule<TValue> = {
  /**
   *Функция валидации.
   * @param value Значение для валидации.
   * @returns `true` если правило провалидировано успешно, `false` если нет.
   */
  isValid: (value: Maybe<TValue>) => boolean;
  /**
   * Уникальный ключ правила.
   */
  key?: string;
  /**
   * Сообщение при ошибке валидации.
   */
  message?: string;
};

export type ValidationOptionsType = {
  /**
   * Сообщение при ошибке валидации.
   */
  message?: string;
  /**
   * Следует ли падать с ошибкой при ошибке валидации.
   */
  throw?: boolean;
};

export type ValidateOptions = {
  /**
   * Путь к полю. Для валидации объектов.
   */
  path?: string;
  /**
   * Следует ли падать с ошибкой при ошибке валидации.
   */
  throw?: boolean;
};

export class ValidationError extends Error {
  /**
   * Путь к полю. Для валидации объектов.
   */
  public path?: string;

  constructor(message?: string, path?: string) {
    super(message);
    this.path = path;
    this.message = message || "";
  }
}

export type DateValue = Date | number | string;

export type SelectOptionType = {
  /**
   * Текст лейбла опции в поле ввода
   *
   * Если не указано свойство content, будет использоваться как основное содержимое опции в списке
   */
  label: string;
  /**
   * Содержимое дополнительного лейбла опции в поле ввода
   *
   * Если не указано свойство content, будет использоваться как дополнительное содержимое опции в списке
   */
  additionalLabel?: ReactNode;
  /**
   * Содержимое опции
   *
   * Не поддерживается в "searchable" режиме
   */
  content?: ReactNode;
  /**
   * Значение опции
   */
  value?: string;
  /**
   * Управление выбранным состоянием опции
   */
  checked?: boolean;
  /**
   * Управление отключенным состоянием опции
   */
  disabled?: boolean;
};

export type Maybe<T> = T | null | undefined;
