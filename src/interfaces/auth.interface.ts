import { Request } from 'express';
import { User } from '@interfaces/users.interface';


export interface AuthModelInterface{
  id?: number;
  accessToken: string;
  refreshToken: string;
  user_id: number;
  expriesIn: string
  createdAt?: Date;
  updatedAt?: Date;
}


export interface DataStoredInToken {
  id: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: any;
}
