var mongoose = require('mongoose');
var config = require('../config');
exports.connect = function (cb) {
  mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'), function (e) {
    if (e) { return cb(e); }
    return cb(null, 'Подключен к базе');
  });
};
