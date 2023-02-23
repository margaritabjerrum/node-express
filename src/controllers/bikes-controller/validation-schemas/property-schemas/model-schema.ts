import * as yup from 'yup';

const modelSchema = yup.string()
  .min(2, 'Must be more than 2 symbols')
  .max(32, 'Must be less than 32 symbols');

export default modelSchema;
