import { RowDataPacket } from 'mysql2';

type PrivateBikeViewModel = {
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

export type BikeViewModel = PrivateBikeViewModel & RowDataPacket;

export type BikeData = Omit<PrivateBikeViewModel, 'id'>;

export type PartialBikeData = Partial<BikeData>;
