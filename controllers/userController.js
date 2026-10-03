const UserData = require("../models/UserSchema");
const LoginData = require('../models/loginSchema');
const bcrypt = require("bcryptjs");
const moment = require("moment");

var country_list = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antigua &amp; Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia &amp; Herzegovina",
    "Botswana",
    "Brazil",
    "British Virgin Islands",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Cape Verde",
    "Cayman Islands",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D Ivoire",
    "Croatia",
    "Cruise Ship",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Polynesia",
    "French West Indies",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kuwait",
    "Kyrgyz Republic",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Pierre &amp; Miquelon",
    "Samoa",
    "San Marino",
    "Satellite",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "St Kitts &amp; Nevis",
    "St Lucia",
    "St Vincent",
    "St. Lucia",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor L'Este",
    "Togo",
    "Tonga",
    "Trinidad &amp; Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks &amp; Caicos",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (US)",
    "Yemen",
    "Zambia",
    "Zimbabwe",
];

// Get Render Pages

// -------------------- GET ---------------------

const getUsers = async (req, res) => {
    try {
        if (!req.session.user) { return res.redirect("/login"); }
        const users = await UserData.find();
        res.render("home", {
            title: "Home Page",
            users: users,
            moment: moment,
            success: req.query.success || null,
            error: req.query.error || null,
        });
    } catch (err) {
        console.log("err", err);
        res.render("home", {
            title: "Home Page",
            users: [],
            success: null,
            error: err.message,
        });
    }
};

const getAddPage = (req, res) => {
    if (!req.session.user) { return res.redirect("/login"); }
    res.render("user/add", { title: "Add User", error: null, success: null, country_list, });
};

const getEditPage = async (req, res) => {
    const user = await UserData.findById(req.params.id);
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.render("user/edit", { title: "Edit User", user, country_list });
};

const getViewPage = async (req, res) => {
    try {
        const user = await UserData.findById(req.params.id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("user/view", { title: "View User", user, moment: moment });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user");
    }
};

// -------------------- Post ---------------------

const addUser = (req, res) => {
    const user = new UserData(req.body);
    user
        .save()
        .then(() => {
            // res.redirect("/user/add.html");
            res.render("user/add", {
                title: "Add User",
                success: "User added successfully",
                error: null,
                country_list,
            });
        })
        .catch((err) => {
            console.log("err", err);
            res.render("user/add", {
                title: "Add User",
                success: null,
                error: err.message,
            });
        });
};

const searchUser = async (req, res) => {
    const searchText = req.body.searchText.trim().toLowerCase();
    try {
        if (searchText === "") {
            return res.redirect("/");
        }
        const users = await UserData.find({
            $or: [
                { firstName: { $regex: searchText, $options: "i" } },
                { lastName: { $regex: searchText, $options: "i" } },
            ],
        });
        res.render("user/search", {
            title: "Home Page",
            users: users,
            moment: moment,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
};

// -------------------- Put ----------------------

const editUser = async (req, res) => {
    try {
        const user = await UserData.findByIdAndUpdate(
            req.params.id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                country: req.body.country,
                gender: req.body.gender,
            },
            {
                new: true,
                runValidators: true,
            },
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.redirect("/?success=User updated successfully");
    } catch (err) {
        console.error(err);
        res.redirect(`/?error=${encodeURIComponent(err.message)}`);
    }
};

// -------------------- Delete --------------------

const deleteUser = async (req, res) => {
    try {
        const user = await UserData.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error deleting user",
        });
    }
};

// ====================== Login ============================== //

const get_login_page = (req, res) => {
    res.render("login/login");
};
const get_register_page = (req, res) => {
    res.render("login/register");
};
const get_profile_page = (req, res) => {
    if (!req.session.user) { return res.redirect("/login"); }
    res.render("login/profile", { user: req.session.user });
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) { return res.status(500).send("Logout failed"); }
        res.redirect("/login");
    });
}

const RegisterUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const exitUser = await LoginData.findOne({ email });
        if (exitUser) { return res.status(400).send("Email already exists"); };
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new LoginData({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await LoginData.findOne({ email });
        if (!user) { return res.status(401).send("Invalid email or password"); }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).send("Invalid email or password"); }
        // Save user in session
        req.session.user = { id: user._id, name: user.name, email: user.email };
        res.json({ success: true, message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = {
    getUsers,
    getAddPage,
    getEditPage,
    getViewPage,
    addUser,
    searchUser,
    editUser,
    deleteUser,
    get_login_page,
    get_register_page,
    get_profile_page,
    logout,
    LoginUser,
    RegisterUser

};
