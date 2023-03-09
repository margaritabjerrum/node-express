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
    IF(COUNT(i.id) = 0, JSON_ARRAY(), JSON_ARRAYAGG(i.src)) as images,
    JSON_OBJECT(
      'id', u.id,
      'firstname', u.firstname,
      'lastname', u.lastname,
      'email', u.email
    ) as owner
  FROM images as i
  LEFT JOIN bikes as b
  ON i.bikeId = b.id
  LEFT JOIN  stats as s
  ON b.statsId = s.id
  LEFT JOIN  users as u
  ON u.id = b.ownerId`;

const GROUP = 'GROUP BY b.id;';

const SQL = {
  SELECT,
  GROUP,
} as const;

export default SQL;
