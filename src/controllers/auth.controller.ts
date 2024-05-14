import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import { configDotenv } from 'dotenv';
import axios from 'axios';
export class AuthController {
  public auth = Container.get(AuthService);
  private GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  private GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  private GOOGLE_REDIRECT_LOGIN_URI = process.env.GOOGLE_REDIRECT_LOGIN_URI;
  // login with email

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: CreateUserDto = req.body;
      const user = await this.auth.login(loginData.email,loginData.password);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  // login with google

  public googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let domainName = req.protocol + '://' + req.hostname;
    let scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${this.GOOGLE_CLIENT_ID}&redirect_uri=${domainName+this.GOOGLE_REDIRECT_LOGIN_URI}&scope=${scopes.join(
      '%20'
    )}`;

    res.redirect(url);
  };

  public googleLoginCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let domainName = req.protocol + '://' + req.hostname;
      const code = req.query.code;
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.GOOGLE_CLIENT_ID,
      client_secret:this.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri:domainName+this.GOOGLE_REDIRECT_LOGIN_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;
    const  userData = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const loginUser = await this.auth.loginWithGoogle(userData.data.email);
    res.status(201).json(loginUser);
    } catch (error) {
      next(error);
    }
  };
}
