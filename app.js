const express = require('express');
const app = express();
const port = 3000;
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
