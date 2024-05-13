import { AuthMiddleware } from '@middlewares/auth.middleware';
import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto ,UpdateUserDto} from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import multer from 'multer';
import path from 'path';
export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();
  public storage  = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/images'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  });

  
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    // get slef user
    this.router.get(`${this.path}`, AuthMiddleware,this.user.getSlefusr);
    // get user by id
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.user.getUserByid);
      // signup with email
    this.router.post(`${this.path}/signup/email`, ValidationMiddleware(CreateUserDto), this.user.createUser);
    // signup with google
    this.router.get(`${this.path}/signup/google`, this.user.googleSignup);
    // handle google signup callback
    this.router.get(`${this.path}/signup/google/callback`, this.user.googleSignupCallback);

    // update user

    this.router.put(`${this.path}`, AuthMiddleware, ValidationMiddleware(UpdateUserDto), this.user.updateUser);
    // update photo
    this.router.put(`${this.path}/photo`, AuthMiddleware, multer({ storage: this.storage }).single('photo'), this.user.updatePhoto);
  }
}
