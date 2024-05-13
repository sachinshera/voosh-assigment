import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { loginWithEmialDto } from '@/dtos/auth.dto';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();
  public path = '/auth';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // login with email

    this.router.post(`${this.path}/email`, ValidationMiddleware(loginWithEmialDto), this.auth.login);
    // login with google

    this.router.get(`${this.path}/google`, this.auth.googleLogin);

    // handle google login callback

    this.router.get(`${this.path}/google/callback`, this.auth.googleLoginCallback);
    
  }
}
