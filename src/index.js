import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

let color = "black";

io.on("connection", (socket) => {
  socket.emit("color", color);

  socket.on("emoji", (emoji) => {
    socket.broadcast.emit("emoji", emoji);
  });

  socket.on("color", (selectedColor) => {
    color = selectedColor;
    socket.broadcast.emit("color", selectedColor);
  });

  socket.on("message", (message) => {
    io.emit("messageForReview", message);
  });

  socket.on("acceptMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("refresh", () => {
    io.emit("refresh");
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./views" });
});

app.get("/display-secret", (req, res) => {
  res.sendFile("display.html", { root: "./views" });
});

app.get("/admin-secret", (req, res) => {
  res.sendFile("admin.html", { root: "./views" });
});

app.get("/qr", (req, res) => {
  res.sendFile("qr-code.svg", { root: "./" });
});

server.listen(port || 3000, () => {
  console.log("listening on *:3000");
});
