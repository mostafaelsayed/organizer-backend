const router = require('express').Router();
const Reservation = require('../../models/reservation.js');


router.get('/getAll', function(req, res) {
    Reservation.findAll().then((reservations) => {
        console.log('all reservations : ', util.inspect(reservations, utilOptions));
        res.json({
            message: 'success',
            reservations: reservations
        }).status(200);
    });
});


module.exports = router;