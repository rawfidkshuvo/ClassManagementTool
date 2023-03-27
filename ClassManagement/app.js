const express = require("express");
const app = express();
const port = 5000;
const userRouter = require("./router/user");
const subjectRouter = require("./router/subject");
const classRouter = require("./router/class");
const testRouter = require("./router/test");
const cors = require("cors");
const auth = require('./auth')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(auth.verify)
app.post('/home',(req,res)=>res.json('Home'))
app.use('', userRouter);
app.use('', subjectRouter);
app.use('', classRouter);
app.use('', testRouter);

app.listen(port, (err) => {
    if(err) {
        res.status(500).send(err)
    }
    console.log(`Example app listening at http://localhost:${port}`)
});