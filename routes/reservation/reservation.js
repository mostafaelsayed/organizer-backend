const router = require('express').Router();
const Reservation = require('../../models/reservation/reservation');
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;
const errorResponses = require('../../models/response/error');
const SuccessResponse = require('../../models/response/success');

router.get('/getAll', function(req, res) {    
    Reservation.findAll({ where: { userId: res.locals.user.id } }).then((reservations) => {
        if (reservations[0]) {
            console.log('success get reservations : ', reservations[0].dataValues);
            reservations = reservations.map((e) => {return e.dataValues;})
            new SuccessResponse('getting reservations', {reservations}).sendResponse(res);
        }
        else {
            new errorResponses.NotFoundResponse('getting reservations').sendResponse(res);
        }
    });
});

router.get('/get/:id', function(req, res) {
    Reservation.findOne({where: {userId: res.locals.user.id, id: req.params.id}}).then((success) => {
        console.log('success get reservation : ', util.inspect(success, utilOptions));
        new SuccessResponse('getting one reservation', {reservation: success.dataValues}).sendResponse(res);
    }).catch((err) => {
        console.error('error get reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('getting one reservation').sendResponse(res);
    });
});

router.post('/add', function(req, res) {
    Reservation.create({name: req.body.reservation.name, userId: res.locals.user.id}).then((success) => {
        console.log('success add reservation : ', util.inspect(success, utilOptions));
        new SuccessResponse('adding one reservation').sendResponse(res);
    }).catch((err) => {
        console.error('error creating reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('adding one reservation').sendResponse(res);
    })
});

router.post('/delete', function(req, res) {
    Reservation.destroy({where: {userId: res.locals.user.id, id: req.body.reservationId}}).then((success) => {
        console.log('success delete reservation : ', util.inspect(success, utilOptions));
        new SuccessResponse('deleting one reservation').sendResponse(res);
    }).catch((err) => {
        console.log('error deleteing reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('deleting one reservation').sendResponse(res);
    });
});

module.exports = router;