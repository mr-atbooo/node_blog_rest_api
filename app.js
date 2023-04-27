const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorsController = require('./controllers/errors');
const categoryRoutes = require('./routes/category');
const feedRoutes = require('./routes/feed');

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


app.use('/categories',categoryRoutes);


app.use('/feed',feedRoutes);

// app.listen('3920',()=>{
//     console.log('Node.js Web server at localhost:3920 is running');
// });

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