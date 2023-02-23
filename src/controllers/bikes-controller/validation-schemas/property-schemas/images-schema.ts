import * as yup from 'yup';

const imagesSchema = yup.array(yup.string().required())
  .min(1, 'images must have at least one image');

export default imagesSchema;
