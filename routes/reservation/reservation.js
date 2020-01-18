const router = require('express').Router();
const Reservation = require('../../database/models/index').Reservation;
const util = require('../../config').util;
const utilOptions = require('../../config').utilOptions;
const errorResponses = require('../../models/response/error');
const SuccessResponse = require('../../models/response/success');
const getUserInfo = require('../../utils').getUserInfo;

router.get('/getAll', function(req, res) {    
    console.log('getAll req user : ', util.inspect(getUserInfo(req, res), utilOptions));
    Reservation.findAll({ where: { userId: getUserInfo(req, res).id } }).then((reservations) => {
        //console.log('all reservations : ', util.inspect(reservations, utilOptions));
        if (reservations[0]) {
            console.log('success get reservations', reservations[0].dataValues);
            reservations = reservations.map((e) => {return e.dataValues;})
            new SuccessResponse('getting reservations', {reservations}).sendResponse(res);
        }
        else {
            new SuccessResponse('getting reservations', {reservations: []}).sendResponse(res);
        }
    }).catch((err) => {
        console.error('error load reservations : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('getting reservations').sendResponse(res);
    });
});

router.get('/get/:id', function(req, res) {
    console.log('one reservation req user : ', util.inspect(getUserInfo(req, res), utilOptions));
    Reservation.findOne({where: {userId: getUserInfo(req, res).id, id: req.params.id}}).then((success) => {
        //success.dataValues.reservationDate = convertDateTime(success.dataValues.reservationDate);
        console.log('success get reservation : ', util.inspect(success.dataValues, utilOptions));
        new SuccessResponse('getting one reservation', {reservation: success.dataValues}).sendResponse(res);
    }).catch((err) => {
        console.error('error get reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('getting one reservation').sendResponse(res);
    });
});

function convertDateTime(time) {
    if (time.indexOf('AM') !== -1) {
        return time.substring(0, time.indexOf(' '));
    }
    else {
        let hours = parseInt(time.substring(0, time.indexOf(' '))) + 12;

        return hours + time.substring(time.indexOf(':'), time.indexOf(' ') + 1);
    }
}

function reverse(s){
    return s.split("").reverse().join("");
}

router.post('/add', function(req, res) {
    console.log('req.body add reservation : ', util.inspect(req.body, utilOptions));
    let dateArr = req.body.reservation.reservationDate.split(', ');
    dateArr[1] = convertDateTime(dateArr[1]);
    //dateArr[1] = dateArr[1].split(' ');
    //dateArr[1][0] += ':00';
    //dateArr[1] = dateArr[1].join(' ');
    console.log('date arr : ', util.inspect(dateArr, utilOptions));
    Reservation.create({name: req.body.reservation.name, userId: getUserInfo(req, res).id, reservationDate: dateArr[0], reservationTime: dateArr[1]}).then((success) => {
        console.log('success add reservation : ', util.inspect(success.dataValues, utilOptions));
        new SuccessResponse('adding one reservation').sendResponse(res);
    }).catch((err) => {
        console.error('error creating reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('adding one reservation').sendResponse(res);
    });
});

router.post('/delete', function(req, res) {
    Reservation.destroy({where: {userId: getUserInfo(req, res).id, id: req.body.reservationId}}).then((success) => {
        console.log('success delete reservation : ', util.inspect(success, utilOptions));
        new SuccessResponse('deleting one reservation').sendResponse(res);
    }).catch((err) => {
        console.error('error deleteing reservation : ', util.inspect(err, utilOptions));
        new errorResponses.InternalErrorResponse('deleting one reservation').sendResponse(res);
    });
});

module.exports = router;