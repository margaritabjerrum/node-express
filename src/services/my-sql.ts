import mysql from 'mysql2';
import config from '../config';

const MySql = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  MySql.connect((conectionErr) => {
    if (conectionErr) throw new Error(conectionErr.message);
  });

  callback();
  MySql.end();
};

export default MySql;
