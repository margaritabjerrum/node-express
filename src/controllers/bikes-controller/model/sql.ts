const SELECT = `
  SELECT 
    b.id, 
    b.brand, 
    b.model, 
    b.year, 
    b.price, 
    JSON_OBJECT(
        'engine', s.engine, 
        'power', s.power, 
        'seatHeight', s.seat_height, 
        'weight', s.weight
        ) as stats, 
    JSON_ARRAYAGG(i.src) as images
  FROM images as i
  LEFT JOIN bikes as b
  ON i.bikeId = b.id
  LEFT JOIN  stats as s
  ON b.statsId = s.id`;

const GROUP = 'GROUP BY b.id;';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
