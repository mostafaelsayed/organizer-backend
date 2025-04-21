import User from "./user/user";
import Reservation from "./reservation/reservation";

User.hasMany(Reservation, {
    sourceKey: 'id',
    foreignKey: 'userId'
});
Reservation.belongsTo(User, {
    targetKey: 'id'
});

export { User, Reservation };