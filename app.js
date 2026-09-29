const express = require('express');
require("dotenv").config();
const app = express();

const port = process.env.PORT || 7000 ;
const mongoose = require('mongoose');

var methodOverride = require('method-override')

const AllRoutes = require('./routes/AllRoutes')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// for Ejs
app.set('view engine', 'ejs');

// Method Override
app.use(methodOverride('_method'))

// End Points
app.use(AllRoutes)


mongoose.connect(
    "mongodb+srv://mady:mady2026@cluster0.quwnjzq.mongodb.net/all-data?appName=Cluster0"
)
    .then(
        () => { app.listen(port, () => { console.log(`DB Connected Successfully http://localhost:${port}`); }); }
    ).catch((err) => { console.log(err); });
