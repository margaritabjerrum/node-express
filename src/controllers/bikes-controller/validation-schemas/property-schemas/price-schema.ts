import * as yup from 'yup';

type ReturnType<T extends boolean> = T extends true
  ? yup.NumberSchema<number>
  : yup.NumberSchema<number | undefined>;

const priceSchema = <T extends boolean = false>(isRequired?: T) => {
  const schema = yup.number()
    .positive('price must be positive')
    .test(
      'isPrice',
      'icorrect price format',
      (val) => {
        if (val === undefined) return !isRequired;
        return Number(val.toFixed(2)) === val;
      },
    );

  if (isRequired) schema.required('price is required');

  return schema as ReturnType<T>;
};

export default priceSchema;
