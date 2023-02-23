import express from 'express';
import { createBike } from './mutations/create-bike';
import { deleteBike } from './mutations/delete-bike';
import { updateBike } from './mutations/update-bike';
import { getBike } from './queries/get-bike';
import { getBikes } from './queries/get-bikes';

const bikesRouter = express.Router();

bikesRouter.get('/', getBikes);
bikesRouter.get('/:id', getBike);

bikesRouter.post('/', createBike);
bikesRouter.delete('/:id', deleteBike);
bikesRouter.patch('/:id', updateBike);

export default bikesRouter;
