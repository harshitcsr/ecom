
const mongoose = require('mongoose');
const url = process.env.DATABASE;
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
};
mongoose.connect(url, connectionParams)
    .then(() => {
        console.log("Connection made to the online database");
    }).catch((err) => {
        console.log("Something went wrong"+err);
    })
