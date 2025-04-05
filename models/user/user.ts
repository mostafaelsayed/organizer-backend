import { DataTypes, Model } from 'sequelize';
import sequalize from '../../database/connection';

interface UserAttributes {
  id?: number;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  passwordHash: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public firstName!: string;
  public lastName?: string;
  public phoneNumber?: string;
  public passwordHash!: string;
  public password!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequalize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  }
);

export default User;