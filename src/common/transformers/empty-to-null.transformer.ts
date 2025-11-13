import { Transform } from 'class-transformer';

interface TransformOptions {
  trim?: boolean;
  emptyValue?: string | null;
}

const normalize = (value: unknown, trim = true): unknown => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const candidate = trim ? value.trim() : value;
  return candidate === '' ? null : candidate;
};

const restore = (value: unknown, emptyValue: string | null) => {
  if (value === null || value === undefined) {
    return emptyValue;
  }
  return value;
};

export const EmptyToNull = (options: TransformOptions = {}) => {
  const { trim = true, emptyValue = '' } = options;

  const toClass = Transform(({ value }) => normalize(value, trim), {
    toClassOnly: true,
  });

  const toPlain = Transform(({ value }) => restore(value, emptyValue), {
    toPlainOnly: true,
  });

  return (target: object, key: string | symbol) => {
    toClass(target, key as string);
    toPlain(target, key as string);
  };
};
