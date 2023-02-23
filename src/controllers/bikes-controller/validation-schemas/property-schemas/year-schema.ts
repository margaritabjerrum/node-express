import * as yup from 'yup';

const yearSchema = yup.number()
  .integer('Year must be integer')
  .min(1950, 'Year must be more than 1950')
  .max(2023, 'Year cannot be more than 2023');

export default yearSchema;
