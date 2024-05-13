import { RequestWithUser } from '@interfaces/auth.interface';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { configDotenv } from 'dotenv';
import axios from 'axios';
import { HttpException } from '@/exceptions/httpException';
configDotenv();
export class UserController {
  public user = Container.get(UserService);
  private GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  private GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  private GOOGLE_REDIRECT_SIGNUP_URI = process.env.GOOGLE_REDIRECT_SIGNUP_URI;
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUser: User = await this.user.createUser(userData);

      res.status(201).json(createUser);
    } catch (error) {
      next(error);
    }
  };

  // get user

  public getSlefusr = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: number = req.user.id;
      const user: User = await this.user.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };


  // get user by id

  public getUserByid = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requester = req.user.id;
      const userId:any =req.params.id;
      const user: User = await this.user.getUserById(userId);
      let isAdmin = await this.user.isUserAdmin(requester);
      let isPublic = user.isPublic;
      if (isAdmin ||  isPublic || requester == userId ) {
        res.status(200).json(user);
      }
      else{
        throw new HttpException(401, 'Unauthorized');
      }
    } catch (error) {
      next(error);
    }
  };


  // update user

  public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: number = req.user.id;
      const userData: CreateUserDto = req.body;
      const updateUser: User = await this.user.updateUserById(userId, userData);
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  };


  // signup with google

  public googleSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${this.GOOGLE_CLIENT_ID}&redirect_uri=${this.GOOGLE_REDIRECT_SIGNUP_URI}&scope=${scopes.join(
      '%20'
    )}`;

    res.redirect(url);
  };

  //handle google signup callback

  public googleSignupCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = req.query.code;
      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.GOOGLE_CLIENT_ID,
      client_secret:this.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri:this.GOOGLE_REDIRECT_SIGNUP_URI,
      grant_type: 'authorization_code',
    });

    const { access_token, id_token } = data;
    const  userData = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const createUser: User = await this.user.createUserWithGoogle(userData.data);

    res.status(201).json(createUser);

    } catch (error) {
      next(error);
    }
  };

  // update photo

  public updatePhoto = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: number = req.user.id;
      // @ts-ignore
     let file = req.file;
     if(file==undefined){
        let file = req.body.photo;
        if(file==undefined){
          throw new HttpException(400, 'No file uploaded');
        }
        const updateUser: User = await this.user.updatePhoto(userId, file);
        res.status(200).json(updateUser);
     }else{
      const updateUser: User = await this.user.updatePhoto(userId, file.filename);
      res.status(200).json(updateUser);
     }
    } catch (error) {
      next(error);
    }
  };


}
