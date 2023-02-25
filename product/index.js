require("./db")
const express = require("express");
const app = express();
const amqp = require("amqplib");
const Product = require("./model/Product");
const isAuthenticated = require("../isAuthenTicated")
const PORT = process.env.PORT_TWO | 8002;
let connection, channel;
let order;

app.use(express.json());

async function connect() {
  const amqpserver = "amqp://localhost:5672"
  connection = await amqp.connect(amqpserver);
  channel = await connection.createChannel();
  await channel.assertQueue("PRODUCT");

}
connect();

app.post("/product/create", isAuthenticated, async (req, res) => {
  const { title, description, price } = req.body;

  const newProduct = new Product({
    title,
    description,
    price
  });
  newProduct.save();
  return res.json({ newProduct })

});

app.post("/product/buy", isAuthenticated, async (req, res) => {
  const { ids } = req.body;

  const products = await Product.find({ _id: { $in: ids } });
  channel.sendToQueue("ORDER", Buffer.from((JSON.stringify({
    products,
    userEmail: req.user.email
  }))))
  channel.consume("PRODUCT", (data) => {
    order = JSON.parse(data.content);
    channel.ack(data);
  })
  return res.json(order);
})

app.listen(PORT, () => {
  console.log(`Product service start working on port ${PORT}`)
});