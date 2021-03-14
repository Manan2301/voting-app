const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTION_URL,{
    useNewUrlParser: true,
    useCreateIndex: true, // makes sure indexes are created when mongoose works with mongodb
    useFindAndModify: false
})
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});