const router = require('express').Router();
const Reservation = require('../../models/reservation/reservation');
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;


router.get('/getAll', function(req, res) {
    console.log('req.session.user : ', util.inspect(req.session.user, utilOptions));
    Reservation.findAll({ where: { userId: req.session.user.id } }).then((reservations) => {
        console.log('all reservations : ', util.inspect(reservations, utilOptions));
        res.json({
            message: 'success',
            reservations: reservations
        }).status(200);
    });
});


module.exports = router;