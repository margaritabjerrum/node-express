import express from 'express';
import { createBike, getBikes } from '../controllers/bikes-controller';

const bikesRouter = express.Router();

bikesRouter.get('/', getBikes);
bikesRouter.post('/', createBike);

export default bikesRouter;
