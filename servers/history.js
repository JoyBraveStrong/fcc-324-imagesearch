const mongoose = require("mongoose");

const moment = require("moment");

// const config = require("../config");

// const M_URL = process.env.MONGOLAB_URI || config.M_URL;

const M_URL = process.env.MONGOLAB_URI

mongoose.Promise = global.Promise;

/* MONGOOSE AND MONGOLAB
 * ----------------------------------------------------------------------------
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 =============================================================================*/

var mongoOptions = {
  server: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }
  },
  replset: {
    socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 }
  }
};

// mongoose.connect(M_URL, mongoOptions);

mongoose.connect(M_URL);

mongoose.connection.on('error', err => console.log(err));

mongoose.connection.once('open', () => console.log('Connection to MongoDB established'));

const historySchema = mongoose.Schema({
    searchTerm: String,
    when: Date,
    date: String
});

const historyModel = mongoose.model('History', historySchema);

function mongoOn() {
    mongoose.connect(M_URL);

    mongoose.connection.on('error', err => console.log(err));

    mongoose.connection.once('open', () => console.log('Connection to MongoDB established'));
}

function mongoOff() {
    mongoose.connection.close(function () {
          console.log('Mongoose connection disconnected');
    });
}

function save(term, callback) {

    // mongoOn();

    var history = new historyModel({
        searchTerm: term,
        when: moment().format(),
        date: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")

    });
    history.save()
        .then(data => callback(data, null))
        .catch(err => callback(null, err));

    // mongoOff();

}


function getList(callback) {

    // mongoOn();

    historyModel.find({}, { '_id': 0, 'searchTerm': 1, 'date': 1}, {limit : 10}).sort({when: -1}).exec()
    .then(data => callback(data, null))
    .catch(err => callback(null, err));

    // mongoOff();

}

module.exports.save = save;
module.exports.getList = getList;
