const router = require('express').Router();
const Reservation = require('../../models/reservation/reservation');
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;


router.get('/getAll', function(req, res) {
    console.log('req.session.user : ', util.inspect(req.session.user, utilOptions));
    Reservation.findAll({ where: { userId: req.session.user.id } }).then((reservations) => {
        if (reservations[0]) {
            console.log('success get reservations : ', reservations[0].dataValues);
            res.json({
                message: 'success',
                reservations: reservations.map((e) => {return e.dataValues;})
            }).status(200);
        }
        else {
            res.json({
                message: 'not found',
                reservations: []
            }).status(404);
        }
    });
});

router.post('/add', function(req, res) {
    Reservation.create({name: req.body.reservation.name, userId: req.body.userId}).then((success) => {
        console.log('success add reservation : ', util.inspect(success, utilOptions));
        res.json({
            message: 'success'
        }).status(200);
    }).catch((err) => {
        console.error('error creating reservation : ', util.inspect(err, utilOptions));
        res.json({
            message: 'error'
        }).status(500);
    })
});

router.post('/delete', function(req, res) {
    Reservation.destroy({where: {id: req.body.reservationId}}).then((success) => {
        console.log('success delete reservation : ', util.inspect(success, utilOptions));
        res.json({
            message: 'success'
        }).status(200);
    }).catch((err) => {
        console.log('error deleteing reservation : ', util.inspect(err, utilOptions));
        res.json({
            message: 'error'
        }).status(500);
    });
});


module.exports = router;