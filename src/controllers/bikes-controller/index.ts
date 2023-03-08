import express, { RequestHandler } from 'express';
import { getBike } from './queries/get-bike';
import { getBikes } from './queries/get-bikes';
import { createBike } from './mutations/create-bike';
import { deleteBike } from './mutations/delete-bike';
import { updateBike } from './mutations/update-bike';
import authMiddleware from '../../middlewares/auth-middleware';

const bikesRouter = express.Router();

bikesRouter.get('/', getBikes);
bikesRouter.get('/:id', getBike);

bikesRouter.post('/', authMiddleware, createBike);
bikesRouter.delete('/:id', authMiddleware, deleteBike as RequestHandler);
bikesRouter.patch('/:id', authMiddleware, updateBike as RequestHandler);

export default bikesRouter;
