import { DataTypes, Model, BelongsToGetAssociationMixin, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import User from '../user/user';
import sequelize from '../../database/connection';

class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description?: CreationOptional<string>;
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare userId: ForeignKey<User['id']>;
  // Timestamps
  declare createdAt?: CreationOptional<Date>;
  declare updatedAt?: CreationOptional<Date>;
}

Reservation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
    }
  },
  {
    sequelize: sequelize, // Pass the connection instance
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: true, // Disable timestamps if not needed
  }
);

export default Reservation;