require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
// const http = require("http");
// const SocketIo = require("socket.io");
var cors = require("cors");

connectToMongo();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000"
  })
);
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/peoples", require("./routes/peoples"));
app.use("/api/companies", require("./routes/companies"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/states", require("./routes/states"));
app.use("/api/user", require("./routes/userdata"));
app.use("/api/plans", require("./routes/plans"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/feedback", require("./routes/feedback"));

app.listen(port, () => {
  console.log(`Cloudlead API listening at http://localhost:${port}`);
});

// const server = http.createServer(app);

// const io = SocketIo(server, {
//   cors: {
//     // origin: "http://localhost:3000",
//     // methods: ["GET", "POST"],
//     // credentials: true,
//     // allowRequest: (req, callback) => {
//     //   const noOriginHeader = req.headers.origin === undefined;
//     //   callback(null, noOriginHeader);
//     // }
//   }
// });

// let interval;

// io.on("connection", (socket) => {
//   console.log("New client connected");
//   // if (interval) {
//   //   clearInterval(interval);
//   // }
//   // interval = setInterval(() => getApiAndEmit(socket), 1000);
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
//   socket.on("initial_watchlist", () => {
//     collection_foodItems.find({}).then(docs => {
//       io.sockets.emit("get_data", docs);
//     });
//   });
// });

// const getApiAndEmit = socket => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
// };

// server.listen(port, () => {
//   console.log(`Cloudlead API listening at http://localhost:${port}`)
// })
