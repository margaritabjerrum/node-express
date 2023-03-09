import * as yup from 'yup';
import { PartialBikeBody } from '../types';
import brandSchema from './property-schemas/brand-schema';
import imagesSchema from './property-schemas/images-schema';
import modelSchema from './property-schemas/model-schema';
import priceSchema from './property-schemas/price-schema';
import statsSchema from './property-schemas/stats-schema';
import yearSchema from './property-schemas/year-schema';

const partialBikeDataValidationSchema: yup.ObjectSchema<PartialBikeBody> = yup.object({
  brand: brandSchema,
  model: modelSchema,
  year: yearSchema,
  price: priceSchema(),
  stats: statsSchema,
  images: imagesSchema,
}).strict(true);

export default partialBikeDataValidationSchema;
