const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const models = require("./app/models");
const port = process.env.PORT || 5000;
const registerUserRoute = require("./app/routes/registerUser");
const loginUserRoute = require("./app/routes/loginUser");
const uuidv4 = require("uuid").v4;
var http = require("http").createServer(app);
const io = require("socket.io")(http);

//bodyParser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());

// Routes
registerUserRoute(app, passport);
loginUserRoute(app, passport);

// load passport strategies
require("./app/config/passport/passport")(passport);

//Sync Databases
(async () => {
  try {
    await models.sequelize.sync();
    console.log("Nice! Database looks fine");
  } catch (err) {
    console.log(err, "Something went wrong with the Database Update!");
  }
})();

let rooms = {};
let chatLogs = {};

app.get("/room", function (req, res, next) {
  const room = {
    name: req.query.name,
    id: uuidv4(),
  };
  rooms[room.id] = room;
  chatLogs[room.id] = [];
  res.json(room);
});

app.get("/room/:roomId", function (req, res, next) {
  const roomId = req.params.roomId;
  const response = {
    ...rooms[roomId],
    chats: chatLogs[roomId],
  };
  res.json(response);
});

io.on("connection", function (socket) {
  socket.on("event://send-message", function (msg) {
    console.log("got", msg);

    const payload = JSON.parse(msg);
    if (chatLogs[payload.roomID]) {
      chatLogs[msg.roomID].push(payload.data);
    }

    socket.broadcast.emit("event://get-message", msg);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
