import bcrypt from 'bcrypt';
import config from 'config';

const hash = (value: string) => bcrypt.hashSync(value, config.secret.bcryptRounds);

const compare = (value: string, hashedValue: string) => bcrypt.compareSync(value, hashedValue);

const BcryptService = {
  hash,
  compare,
} as const;

export default BcryptService;
