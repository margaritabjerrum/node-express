import {
  object, string, number, array, ObjectSchema,
} from 'yup';
import { PartialBikeData } from '../types';

const partialBikeDataValidationSchema: ObjectSchema<PartialBikeData> = object({
  brand: string()
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),

  model: string()
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),

  year: number()
    .integer('Year must be integer')
    .min(1950, 'Year must be more than 1950')
    .max(2023, 'Year cannot be more than 2023'),

  price: number()
    .positive('price must be positive')
    .test(
      'isPrice',
      'icorrect price format',
      (val) => {
        if (val === undefined) return true;
        return Number(val.toFixed(2)) === val;
      },
    ),

  stats:
    object({
      engine: string()
        .required('Engine is required')
        .min(2, 'Must be more than 2 symbols')
        .max(32, 'Must be less than 32 symbols'),
      power: string()
        .required('Power is required')
        .min(2, 'Must be more than 2 symbols')
        .max(32, 'Must be less than 32 symbols'),
      seatHeight: string()
        .required('Seat Height is required')
        .min(2, 'Must be more than 2 symbols')
        .max(32, 'Must be less than 32 symbols'),
      weight: string()
        .required('Weight is required')
        .min(2, 'Must be more than 2 symbols')
        .max(32, 'Must be less than 32 symbols'),
    }),

  images: array()
    .of(string().required())
    .min(1, 'images must have at least one image'),
}).strict(true);

export default partialBikeDataValidationSchema;
