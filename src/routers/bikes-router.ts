import express from 'express';
import {
  getBike,
  getBikes,
  createBike,
  deleteBike,
  updateBike,
} from '../controllers/bikes-controller';

const bikesRouter = express.Router();

bikesRouter.get('/', getBikes);
bikesRouter.get('/:id', getBike);

bikesRouter.post('/', createBike);
bikesRouter.delete('/:id', deleteBike);
bikesRouter.patch('/:id', updateBike);

export default bikesRouter;
