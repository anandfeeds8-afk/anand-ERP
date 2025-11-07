const { createClient } = require("redis");

const client = createClient({
  username: "default",
  password: "GnFP7kytLp6IZzytToJ5KbAlnSpCOjG7",
  socket: {
    host: "redis-15933.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 15933,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

module.exports = { client };
