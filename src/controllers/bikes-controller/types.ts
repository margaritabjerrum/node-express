import { RowDataPacket } from 'mysql2';

type PrivateBikeModel = {
  id: number,
  brand: string,
  model: string,
  year: number,
  price: number,
  stats: {
    engine: string,
    power: string,
    seatHeight: string,
    weight: string,
  },
  images: string[]
};

export type BikeModel = PrivateBikeModel & RowDataPacket;

export type BikeData = Omit<PrivateBikeModel, 'id'>;

export type PartialBikeData = Partial<BikeData>;
