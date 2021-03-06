
const express = require ('express');
const ejs = require('express-ejs-layouts');
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5505;
const flash = require('connect-flash');
const session = require ('express-session');

const passport = require ('passport');

// passport comfig 
require("./config/passport")(passport)

const app = express();



// express body parser
app.use(express.urlencoded({extended: true }))
app.use(express.json())

const db = require('./config/keys').mongoURI;

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log('connected,,'))
.catch((err) => console.log(err));


// serve statics
app.use("/assets", express.static(__dirname + "/assets"));


app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true,
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());



// connecting flash 
app.use(flash());

// EJS templating engine
app.use(ejs)
app.set('layout','./layout');
app.set('views','./views');
app.set("view engine" , "ejs");
app.use(require('./functions').useLocals);


// global variables
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});


// Routes 
app.use("/", require("./routes/index"));
app.use("/users",require("./routes/users"));
app.use("/dashboard",require("./routes/dashboard"));


app.listen(PORT,console.log(`Server listening at ${PORT}`));
