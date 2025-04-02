import { DataTypes, Model } from 'sequelize';
import User from '../user/user';
import sequelize from '../../database/connection';

interface ReservationAttributes {
  id?: number;
  name: string;
  userId: number;
}

class Reservation extends Model<ReservationAttributes> implements ReservationAttributes {
  public id!: number;
  public name!: string;
  public userId!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reservation.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize: sequelize, // Pass the connection instance
    modelName: 'Reservation',
    tableName: 'reservations',
    timestamps: false, // Disable timestamps if not needed
  }
);

export default Reservation;