import mysql from 'mysql';
import config from '../config';

const connection = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  connection.connect((conectionErr) => {
    if (conectionErr) throw new Error(conectionErr.message);
  });

  callback();
  connection.end();
};

export default connection;
