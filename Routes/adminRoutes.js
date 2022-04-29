const exp = require('express')

const routes = exp.Router();

const User=require("../models/User");


routes.get("/view", async (request, response) => {
    const user = await User.find({});
  
    try {
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
  });

















module.exports = routes;