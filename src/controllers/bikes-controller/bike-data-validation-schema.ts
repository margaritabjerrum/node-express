import {
  object, string, number, array, ObjectSchema,
} from 'yup';
import { BikeData } from './types';

const bikeDataValidationSchema: ObjectSchema<BikeData> = object({
  brand: string()
    .required('Brand is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),

  model: string()
    .required('Model is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),

  year: number()
    .required('Year is required')
    .integer('Year must be integer')
    .min(1950, 'Year must be more than 1950')
    .max(2023, 'Year cannot be more than 2023'),

  price: number()
    .required('price is required')
    .positive('price must be positive')
    .test(
      'isPrice',
      'icorrect price format',
      (val) => Number(val.toFixed(2)) === val,
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
    })
      .required('Stats is required'),

  images: array()
    .of(string().required())
    .required('Is required')
    .min(1, 'images must have at least one image'),
}).strict(true);

export default bikeDataValidationSchema;
