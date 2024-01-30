const mongoose = require("mongoose");
const URL =
  "mongodb+srv://vijaydev9030:Vijaykumar143@cluster0.nxp2bje.mongodb.net/schoolManagement?retryWrites=true&w=majority";

module.exports = mongoose.connect(URL, (err) => {
  if (err) {
    throw err;
  }
  console.log("connected to db succesfully");
});
