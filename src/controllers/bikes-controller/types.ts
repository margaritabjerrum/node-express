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
  images: string[],
  owner: {
    id: number,
    name: string,
    surname: string,
    email: string,
  }
};

export type BikeViewModel = PrivateBikeViewModel & RowDataPacket;

export type BikeData = Omit<PrivateBikeViewModel, 'id' | 'owner'> & {
  ownerId: number,
};

export type BikeBody = Omit<BikeData, 'ownerId'>;

export type PartialBikeBody = Partial<BikeBody>;
