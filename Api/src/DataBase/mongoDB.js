const mongoose = require('mongoose');

mongoose.connect(`${process.env.DB_HOST}`).then(() => {
    console.log('Connection made successfully - MyPharma');
}).catch((error) => {
    console.error(error);
});

mongoose.Promise = global.Promise;
module.exports = mongoose;