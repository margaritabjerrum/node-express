import * as yup from 'yup';
import { Credentials } from '../types';

const credentialsValidationSchema: yup.ObjectSchema<Credentials> = yup.object({
  email: yup.string()
    .email('Incorect email format')
    .required('Email is required'),
  password: yup.string()
    .min(8, 'Must be at least 8 symbols')
    .max(32, 'Must be less than 32 symbols')
    .matches(/[A-Z]{1}/, 'Password must have at least one Upper case letter')
    .matches(/[a-z]{1}/, 'Password must have at least one Lower case letter')
    .matches(/[0-9]{1}/, 'Password must have at least one Number')
    .matches(/[#?!@$%^&*-]{1}/, 'Password must have at least one special symbol case letter')
    .required('Password is required'),
});

export default credentialsValidationSchema;
