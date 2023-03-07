const SELECT = `
SELECT id, email, password, firstname, lastname, role
FROM users as u`;

const SQL = {
  SELECT,
};

export default SQL;
