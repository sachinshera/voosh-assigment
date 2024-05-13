import { AuthModelInterface } from './../interfaces/auth.interface';
import { Sequelize, DataTypes, Model, Optional } from 'sequelize';


export type AuthCreationAttributes = Optional<AuthModelInterface, 'id'>;

export class AuthModel extends Model<AuthModelInterface, AuthCreationAttributes> implements AuthModelInterface {
  public id: number;
  public accessToken: string;
  public refreshToken: string;
  public user_id: number;
  public expriesIn: string
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


export default function (sequelize: Sequelize): typeof AuthModel {
  AuthModel.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      accessToken: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      refreshToken: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      expriesIn: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    },
    {
      tableName: 'auth',
      sequelize,
    },
  );

  return AuthModel;
}