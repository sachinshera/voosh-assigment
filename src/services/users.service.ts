import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';

@Service()
export class UserService {

  // check is user admin

  public async isUserAdmin(userId: number): Promise<boolean> {
    const findUser: User = await DB.Users.findOne({ where: { id: userId } });
    if (!findUser) return false;
    return findUser.isAdmin;
  };

  // get user by id

  public async getUserById(userId: number): Promise<any> {
    const findUser: User = await DB.Users.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!findUser) throw new HttpException(409, `User with id ${userId} not found`);
    return findUser;
  };

  // update user by id

  public async updateUserById(userId: number, userData: CreateUserDto): Promise<any> {
    const findUser: User = await DB.Users.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, `User with id ${userId} not found`);
    if(userData.password) userData.password = await hash(userData.password, 10);
    if(userData.email) throw new HttpException(409, `You can't update email`);
    await DB.Users.update(userData, { where: { id: userId } });
    let data =  {
      id: userId,
      email: findUser.email,
      photo: findUser.photo,
      name: findUser.name,
      bio: findUser.bio,
      phone: findUser.phone,
      signupMethod: findUser.signupMethod,
      isPublic: findUser.isPublic,
    }
    return data;
  };


  public async createUser(userData: CreateUserDto): Promise<any> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    var createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });
    var data = {
      id: createUserData.id,
      email: createUserData.email,
      photo: createUserData.photo,
      name: createUserData.name,
      bio: createUserData.bio,
      phone: createUserData.phone,
      signupMethod: createUserData.signupMethod,
      isPublic: createUserData.isPublic,
    }
    return data;
  };

  // create user with google 

  public async createUserWithGoogle(userData: any): Promise<any> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

   try{
    var createUserData: User = await DB.Users.create({
      email: userData.email,
      photo: userData.picture,
      name: userData.name,
      signupMethod: 'google',
     });

    var data = {
      id: createUserData.id,
      email: createUserData.email,
      photo: createUserData.photo,
      name: createUserData.name,
      bio: createUserData.bio,
      phone: createUserData.phone,
      signupMethod: createUserData.signupMethod,
      isPublic: createUserData.isPublic,
    }

    return data;
   }catch(error){
     throw new HttpException(500, error);
   }

  };

  // update photo

  public async updatePhoto(userId: number, photo: string): Promise<any> {
    const findUser: User = await DB.Users.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, `User with id ${userId} not found`);
    await DB.Users.update({ photo }, { where: { id: userId } });
    return { photo };
  };
}
