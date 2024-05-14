import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { User } from '@interfaces/users.interface';

export type UserCreationAttributes = Optional<User, 'id' | 'email' | 'password'>;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id: number;
  public email: string;
  public password: string;
  public photo: string;
  public name: string;
  public bio: string;
  public phone: number;
  public signupMethod: string;
  public isPublic: boolean;
  public isAdmin: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof UserModel {
  UserModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      password: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      photo: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(45),
      },
      bio: {
        allowNull: true,
        type: DataTypes.STRING(255),
      },
      phone: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },  
      signupMethod: {
        allowNull: false,
        type: DataTypes.STRING(45),
        defaultValue: 'email',
      },
      isPublic: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isAdmin: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    },
    {
      tableName: 'users',
      sequelize,
    },
  );


  return UserModel;
}
