import bcrypt from "bcrypt";

export const bcryptHashAsync = (
  password: string,
  saltRounds: number
): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (!err) resolve(hash);
      else reject(err);
    });
  });

export const bcryptCompareAsync = (
  password: string,
  hash: string
): Promise<boolean> =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (!err) resolve(result);
      else reject(err);
    });
  });
