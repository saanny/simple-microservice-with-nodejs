require("./db")
const express = require("express");
const app = express();
const amqp = require("amqplib");
const Order = require("./model/Order");
const isAuthenticated = require("../isAuthenTicated")
const PORT = process.env.PORT_TWO | 8003;
let connection, channel;


app.use(express.json());
function createOrder(products, userEmail) {
  let total = 0;
  for (let t = 0; t < products.length; ++t) {
    total += products[t].price;
  }

  const newOrder = new Order({
    products,
    user: userEmail,
    total_price: total
  })
  newOrder.save();
  return newOrder;
}

async function connect() {
  const amqpserver = "amqp://localhost:5672"
  connection = await amqp.connect(amqpserver);
  channel = await connection.createChannel();
  await channel.assertQueue("ORDER");

}
connect().then(() => {
  channel.consume("ORDER", async data => {
    const { products, userEmail } = JSON.parse(data.content);

    const newOrder = createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue("PRODUCT", Buffer.from((JSON.stringify({ newOrder }))))
  })
});



app.listen(PORT, () => {
  console.log(`Order service start working on port ${PORT}`)
});