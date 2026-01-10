import { DataTypes, Model, HasManyGetAssociationsMixin, InferAttributes, InferCreationAttributes, NonAttribute, CreationOptional, Association } from 'sequelize';
import sequalize from '../../database/connection';
import Reservation from '../reservation/reservation';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare firstName?: string;
  declare lastName?: CreationOptional<string>;
  declare phoneNumber?: CreationOptional<string>;
  declare passwordHash?: string;
  declare password: NonAttribute<string>;
  declare reservations?: NonAttribute<Reservation[]>;
  declare getReservations: HasManyGetAssociationsMixin<Reservation>
  declare authType: string;

  // Timestamps
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;

  declare static associations: {
    projects: Association<User, Reservation>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'basic'
    }

  },
  {
    sequelize: sequalize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

User.hasMany(Reservation, {onDelete: 'CASCADE', hooks: true})

export default User;