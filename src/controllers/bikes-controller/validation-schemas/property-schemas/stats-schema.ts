import * as yup from 'yup';

const statsSchema = yup.object({
  engine: yup.string()
    .required('Engine is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),
  power: yup.string()
    .required('Power is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),
  seatHeight: yup.string()
    .required('Seat Height is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),
  weight: yup.string()
    .required('Weight is required')
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols'),
});

export default statsSchema;
