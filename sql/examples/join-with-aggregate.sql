SELECT h.id, h.title, l.country, l.city, h.price, h.rating, JSON_ARRAYAGG(i.src)
FROM images as i
LEFT JOIN houses as h
ON i.houseId = h.id
LEFT JOIN  locations as l
ON h.locationId = l.id
GROUP BY h.id;