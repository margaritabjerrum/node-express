import * as yup from 'yup';
import { BikeBody } from '../types';
import brandSchema from './property-schemas/brand-schema';
import imagesSchema from './property-schemas/images-schema';
import modelSchema from './property-schemas/model-schema';
import priceSchema from './property-schemas/price-schema';
import statsSchema from './property-schemas/stats-schema';
import yearSchema from './property-schemas/year-schema';

const bikeDataValidationSchema: yup.ObjectSchema<BikeBody> = yup.object({
  brand: brandSchema.required('Brand is required'),
  model: modelSchema.required('Model is required'),
  year: yearSchema.required('Year is required'),
  price: priceSchema(true),
  stats: statsSchema.required('Stats is required'),
  images: imagesSchema.required('Is required'),
}).strict(true);

export default bikeDataValidationSchema;
