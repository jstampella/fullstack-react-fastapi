export enum Roles {
  Admin = 'admin',
  Internal = 'internal',
  User = 'user',
}

export interface IUserPayload {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface IUser {
  name: string;
  age: number;
  email: string;
  role: Array<Roles> | Array<string>;
  password: string;
}

export interface tokenPayload {
  accessToken: string;
  refreshToken: string;
}

export interface IverifyToken {
  id: string;
  mail: string;
}

export interface payloadLogin {
  email: string;
  password: string;
}

export interface payloadRegister {
  email: string;
  password: string;
  name: string;
}

export interface payloadRenewToken {
  token: string;
}

export interface AccessTokenData {
  user: IUserPayload;
  iat: number;
  exp: number;
}

export interface RefreshTokenData {
  _id: string;
  iat: number;
  exp: number;
}
