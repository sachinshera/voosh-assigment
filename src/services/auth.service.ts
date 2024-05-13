import { AuthModelInterface } from './../interfaces/auth.interface';
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { AuthModel } from '@/models/auth.model';
import { configDotenv } from 'dotenv';
import { UserModel } from '@/models/users.model';
configDotenv();
@Service()
export class AuthService {
  // login user by email and password

  public async login(email: string, password: string) {
    var user = await UserModel.findOne(
      { where: { email },
      attributes: { exclude: ['createdAt', 'updatedAt']}
    }
    );
      if (!user) throw new HttpException(401, 'Email not found');
      if (user.signupMethod !== 'email') throw new HttpException(401, 'This email is  registered with ' + user.signupMethod+" Please login with google");
      const isPasswordMatching = await compare(password, user.password);
      if (!isPasswordMatching) throw new HttpException(401, 'Incorrect Password');
      // remove password from user object
      user.password = undefined;
      let token = await this.createToken(user.id.toString());
      return {
        user,
        token,
      };
  };

  // login with google

  public async loginWithGoogle(email: string) {
    var user = await UserModel.findOne({
      where: { email, signupMethod: 'google'},
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    if (!user) throw new HttpException(401, 'User not found');

    let token = await this.createToken(user.id.toString());

    user.password = undefined;
    return {
      user,
      token,
    };
  }

  // create and save access and refresh token by user id

  public async createToken(userid: string) {
    const user_id = parseInt(userid);
    var accessToken = await this.createAccessToken(user_id);
    const refreshToken = await this.createRefreshToken();
    var expiresIn:any = new Date();
    expiresIn.setHours(expiresIn.getHours() + 12);
    await AuthModel.create({ accessToken, refreshToken, user_id, expriesIn: expiresIn});
    return { accessToken, refreshToken };
  }

  public async createAccessToken(userid: number) {
    const expiresIn = 60 * 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: userid as any,
    };
    return sign(dataStoredInToken, secret, { expiresIn });
  }

  // create refresh token hash

  public async createRefreshToken() {
    let ramdonString = Math.random().toString(36).substring(7);
    return await hash(ramdonString, 10);
  }

  // verify refresh token

  public async verifyRefreshToken(refreshToken: string): Promise<boolean> {
    const auth = await AuthModel.findOne({ where: { refreshToken } });
    if (!auth) throw new HttpException(401, 'Invalid refresh token');
    return true;
  }

  // verify access token

  public async verifyAccessToken(token: string): Promise<DataStoredInToken> {
    try {
      const secret = process.env.JWT_SECRET;
      let verifyToken = sign(token, secret);
      return verify(verifyToken, secret) as DataStoredInToken;
    } catch (error) {
      throw new HttpException(401, 'Invalid access token');
    }
  }

  // refresh access token

  public async refreshAccessToken(refreshToken: string): Promise<TokenData> {
    const auth = await AuthModel.findOne({ where: { refreshToken } });
    if (!auth) throw new HttpException(401, 'Invalid refresh token');
    const expiresIn = 60 * 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: auth.user_id,
    };
    return {
      expiresIn,
      token: sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  // delete both access and refresh token

  public async deleteToken(refreshToken: string): Promise<boolean> {
    const auth = await AuthModel.findOne({ where: { refreshToken } });
    if (!auth) throw new HttpException(401, 'Invalid refresh token');
    await auth.destroy();
    return true;
  }

  // logout user by user id

  public async logoutUser(userId: number): Promise<boolean> {
    const auth = await AuthModel.findOne({ where: { user_id: userId } });
    if (!auth) throw new HttpException(401, 'User not found');
    await auth.destroy();
    return true;
  };

  // get user id by access token

  public async getUserByToken(token: string): Promise<any> {
    let user=  await AuthModel.findOne({ where: { accessToken: token } });
    if (!user) throw new HttpException(401, 'User not found');
    return user;
  }
}
