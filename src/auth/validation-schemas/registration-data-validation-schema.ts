import * as yup from 'yup';
import { RegistrationBody } from '../types';

const registrationDataValidationSchema: yup.ObjectSchema<RegistrationBody> = yup.object({
  email: yup.string()
    .email('Incorect email format')
    .required('Email is required'),

  firstname: yup.string()
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols')
    .required('Firstname is required'),

  lastname: yup.string()
    .min(2, 'Must be more than 2 symbols')
    .max(32, 'Must be less than 32 symbols')
    .required('Lasttname is required'),

  password: yup.string()
    .min(8, 'Must be at least 8 symbols')
    .max(32, 'Must be less than 32 symbols')
    .matches(/[A-Z]{1}/, 'Password must have at least one Upper case letter')
    .matches(/[a-z]{1}/, 'Password must have at least one Lower case letter')
    .matches(/[0-9]{1}/, 'Password must have at least one Number')
    .matches(/[#?!@$%^&*-]{1}/, 'Password must have at least one special symbol case letter')
    .required('Password is required'),

  passwordConfirmation: yup.string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  // .when('password', (([password], schema) => {
  //   if (password) return schema.matches(new RegExp(password, 'g'));
  //   return schema;
  // })),
}).strict(true);

export default registrationDataValidationSchema;
