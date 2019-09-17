const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require ('method-override'),
    mongoose = require('mongoose'),
    flash = require ('connect-flash'),
    passport = require ('passport'),
    LocalStrategy = require ('passport-local'),
    Campground = require('./models/campground'),
    Comment = require ('./models/comment'),
    User   = require ('./models/user'),
    seedDB = require('./seeds');



const   commentRoutes = require('./routes/comments'),
        campgroundRoutes = require ('./routes/campgrounds'),
        indexRoutes = require ('./routes/index');

// activate the metod override to use the PUT and DELETE methodes for the form
app.use(methodOverride('_method'));

// to parse the variable from the route inside by body.[variable]
app.use(bodyParser.urlencoded({ extended: true }));

// to use the public directory for our main.css file:
app.use(express.static(__dirname+'/public'));

// use the ejs for ejs tags and ejs files inside the views directory
app.set('view engine', 'ejs');

//using flash (this line must be before passport configuration)
app.use(flash());

 
// passport configuration
app.use(require ('express-session')({
    secret: "This a key to encode the YelpCamp app login",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seting the mongoose on the database
mongoose.connect("mongodb+srv://hrferdowsi:Msi+1992@cluster0-glrab.mongodb.net/test?retryWrites=true&w=majority", { 
    useNewUrlParser: true,
    useCreateIndex:true 
}).then(()=>{
    console.log('connected to DB');
}).catch(err =>{
    console.log(`Error: ${err.message}`);
});

mongoose.set('useFindAndModify', false);

// seed DataBase() to feed our DB:
// seedDB();

//passing current user to every single templates:
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})

// RESTful Routes:
// INDEX            /campgrounds            GET
// NEW              /campgrounds/new        GET
// CREATE           /campgrounds            POST
// SHOW             /campgrounds/:id        GET
// nested Routes inside show:
// NEW              campgrounds/:id/comments/new     GET
// CREATE           campgrounds/:id/comments         POST

// Routes directions
app.use('/',indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);


app.listen(process.env.PORT || 3000, () => {
    console.log("server is running" );
})