const dbconfig = require("./config");
const express = require("express");
const bcrypt = require("bcrypt"); 
const fetch = require("node-fetch");
var jwt = require('jsonwebtoken');
exports.verify = function(req,res,next){
    const access = req.headers["auth"]
    if(typeof access !== 'undefined') {
        req.token = access
        next()
    }
    else {
        res.sendStatus(403)
    }
}
