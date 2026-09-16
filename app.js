const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');


// Model Schema
const UserData = require('./models/UserSchema');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// for Ejs
app.set('view engine', 'ejs');



// End Points

// Gets Pages
// -----------------------------------------

app.get('/', async (req, res) => {
    try {
        const users = await UserData.find();
        console.log("users", users);
        res.render('home', { title: "Home Page", users: users });
    }
    catch (err) {
        console.log("err", err);
        res.render('home', { title: "Home Page", users: [], error: err.message });
    }
});

app.get('/user/add.html', (req, res) => {
    res.render('user/add', { title: "Add User", error: null })
})

app.get('/user/edit.html', (req, res) => {
    res.render('user/edit', { title: "Edit User" })
})

app.get('/user/view/:id', async (req, res) => {
    try {
        const user = await UserData.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render('user/view', { title: "View User", user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user");
    }
});

// ===========================================


// Post Req Users 


app.post("/user/add.html", (req, res) => {
    const user = new UserData(req.body);

    user.save()
        .then(() => {
            console.log("user Added Seuccessfully: ", user)
            res.redirect("/user/add.html");
        })
        .catch((err) => {
            console.log("err", err);
            res.render("user/add", {
                title: "Add User",
                error: err.message
            });
        })
})











mongoose.connect(
    "mongodb+srv://mady:mady2026@cluster0.quwnjzq.mongodb.net/all-data?appName=Cluster0"
)
    .then(
        () => { app.listen(port, () => { console.log(`DB Connected Successfully http://localhost:${port}`); }); }
    ).catch((err) => { console.log(err); });


// app.listen(port, () => {
//     console.log(`app listening http://localhost:${port}/`);
// });