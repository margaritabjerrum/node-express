export type BikeModel = {
  id: string,
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

export type BikeData = Omit<BikeModel, 'id'>;
