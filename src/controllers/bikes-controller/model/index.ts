import { getBike } from './get-bike';
import { getBikes } from './get-bikes';
import { createBike } from './create-bike';
import { deleteBike } from './delete-bike';
import { updateBike } from './update-bike';

const BikeModel = {
  getBike,
  getBikes,
  createBike,
  deleteBike,
  updateBike,
};

export default BikeModel;
