import { RowDataPacket } from 'mysql2';

export interface BikeModel extends RowDataPacket {
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
}

export type BikeData = Omit<BikeModel, 'id'>;

export type PartialBikeData = Partial<BikeData>;
