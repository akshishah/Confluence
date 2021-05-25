const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride =  require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressErrror = require('./utils/ExpressError');
const commentRoute = require('./routes/comments');
const postRoute = require('./routes/posts');
const session = require('express-session');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/comeTogether', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("We're Connected to Mongo!!!");
    })
    .catch(err => {
        console.log("Ohh some error occured on Mongo connection");
        console.log(err);
    })

const sessionConfig = {
    secret : 'randomunknownsecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expire : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7 
    }
}

app.use(session(sessionConfig));
app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));   

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    //res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));


app.use('/posts',postRoute);
app.use('/posts/:id/comments',commentRoute);


app.get('/', (req, res) => {
    res.send('Home Page!!')
})

app.all('*',(req,res,next) =>{
    next(new ExpressErrror('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    const {status = 500} = err;
    if(!err.message) err.message='Oh No Something Went Wrong';
    res.status(status).render('error',{err});    
})

app.listen(3000, () => {
    console.log('App listening on 3000');
})