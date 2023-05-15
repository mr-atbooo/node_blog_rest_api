const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');

const flash = require('connect-flash');

const app = express();

// const csrfProtection = csrf();
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

app.set('view engine','ejs');
app.set('views','views');

// st web routes
const webErrorsController = require('./controllers/api/errorsController');
const webCategoryRoutes = require('./routes/web/categoryRoute');
const webTagRoutes = require('./routes/web/tagRoute');
const webPostRoutes = require('./routes/web/postRoute');
const webCommentRoutes = require('./routes/web/commentRoute');
const webPageRoutes = require('./routes/web/pageRoute');
const webUserRoutes = require('./routes/web/userRoute');
const webAuthRoutes = require('./routes/web/authRoute');


// st api routes
const errorsController = require('./controllers/api/errorsController');
const categoryRoutes = require('./routes/api/categoryRoute');
const tagRoutes = require('./routes/api/tagRoute');
const postRoutes = require('./routes/api/postRoute');
const commentRoutes = require('./routes/api/commentRoute');
const pageRoutes = require('./routes/api/pageRoute');
const userRoutes = require('./routes/api/userRoute');
const authRoutes = require('./routes/api/authRoute');
const userModel = require('./models/userModel');




app.use(bodyParser.urlencoded({extended: true})); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
// app.use(multer().single('image'));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
// app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    userModel.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// st web routes
app.use('/dashboard/categories',webCategoryRoutes);
app.use('/dashboard/tags',webTagRoutes);
app.use('/dashboard/posts',webPostRoutes);
app.use('/dashboard/comments',webCommentRoutes);
app.use('/dashboard/pages',webPageRoutes);
app.use('/dashboard/users', webUserRoutes);
app.use( webAuthRoutes);

// st api routes
app.use('/api/v1/categories',categoryRoutes);
app.use('/api/v1/tags',tagRoutes);
app.use('/api/v1/posts',postRoutes);
app.use('/api/v1/comments',commentRoutes);
app.use('/api/v1/pages',pageRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);


app.use('/images', express.static(path.join(__dirname, 'images')));



app.use(errorsController.error404);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/blog')
.then(result=>{
  app.listen('3920',()=>{
    console.log('Node.js Web server at localhost:3920 is running');
});
})
.catch(err=>{
  console.log(err);
});
