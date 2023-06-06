import express from 'express';
import mongoose from "mongoose";
import { productsRouter } from "./routers/products.routers.js";
import { cartsRouter } from "./routers/carts.routers.js";
import handlebars from "express-handlebars";
import * as path from "path";
import messageRouter from "./routers/messages.router.js";
import viewsRouter from "./routers/views.router.js";
import messageManager from "./dao/dbmanagers/message.manager.js";
import {app, io } from "./utils.js";


app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.engine("handlebars", handlebars.engine());

app.set("views", "views/");

app.use(express.static("public"));

app.use("/", viewsRouter);

app.set("view engine", "handlebars");

app.use(express.static(path.join(process.cwd() + "/public")));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);
 
mongoose.connect(
  "mongodb+srv://marianonakamura:pU77mD4xz87bI6Tr@codercluster.20kgbjc.mongodb.net/?retryWrites=true&w=majority",
  { dbName: "ecommerce" }
);

app.use("/api/messages", messageRouter);



io.on("connection", async (socket) => {
  socket.on("message", async (data) => {
    await messageManager.postMessage(data);
    io.emit("messageLogs", await messageManager.getMessages());
  });

  socket.on("sayhello", async (data) => {
    io.emit("messageLogs", await messageManager.getMessages());
    socket.broadcast.emit("alert", data);
  });
});
