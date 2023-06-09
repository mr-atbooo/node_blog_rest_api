const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const errorsController = require('./controllers/errors');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const pageRoutes = require('./routes/page');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');


const app = express();

app.use(bodyParser.urlencoded({extended: true})); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
// app.use(multer().single('image'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


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
