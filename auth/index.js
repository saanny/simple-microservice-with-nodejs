require("./db")
const express = require("express");
const User = require("./model/User");
const JWT = require("jsonwebtoken")
const app = express();

const PORT = process.env.PORT_ONE | 8001;



app.use(express.json());
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) return res.json({ message: "user already exist" })
  const newUser = new User({
    name,
    email,
    password
  });
  await newUser.save();
  return res.json(newUser);

})
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "user dose not exist" })
  if (password !== user.password) return res.json({ message: "email or password is wrong" })
  const payload = {
    email,
    name: user.name
  };
  JWT.sign(payload, "secret string", (err, token) => {
    if (err) {
      console.log(err)
    } else {
      return res.json({ token })
    }
  });
})



app.listen(PORT, () => {
  console.log(`Auth service start working on port ${PORT}`)
});