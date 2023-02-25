const mongoose = require("mongoose");


mongoose.set('strictQuery', true);
mongoose.connect(`mongodb://0.0.0.0/auth-service`, {
  useNewUrlParser: true, useUnifiedTopology: true
});
mongoose.connection.on("open", () => {
  console.log(`Auth service Db connected`)
});
mongoose.connection.on("error", (err) => {
  console.error(`field to connect`, err.message);
});
