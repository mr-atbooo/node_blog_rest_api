//models/product.js in model folder
const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: false
  },
  // parentCat: {
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: 'User'
  //   }
  // },
  content: {
    type: String,
    required: false
  }
});

categorySchema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', categorySchema);








// const getDB = require('../util/database').getDb;
// const mongodb = require('mongodb');

// module.exports = class Product{
//     constructor(id,title,price,description,imgUrl,userId){
//         this._id = id;
//         this.title = title;
//         this.title = title;
//         this.price = price;
//         this.description =description;
//         this.imgUrl =imgUrl;
//         this.userId =userId;
//     }

//     save()
//     {
//         const db = getDB();
//         let dbOp;
//         if (this._id) {
//         // Update the product
//         dbOp = db
//             .collection('products')
//             .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
//         } 
//         else {
//             // Store the product
//         dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp
//         .then(result=>{
//             console.log(result);
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }


//      static fetchAll(){
//         const db = getDB();
//         return  db.collection('products').find().toArray()
//         .then(products=>{
//             console.log(products);
//             return products;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }

//     static findById(prodId) {
//         console.log(prodId);
//         const db = getDB();
//         return db.collection('products')
//           .find({ _id: new mongodb.ObjectId(prodId) })
//           .next()
//           .then(product => {
//             console.log(product);
//             return product;
//           })
//           .catch(err => {console.log(err);});
//       }

//     static deleteById(prodId) {
//         const db = getDB();
//         return db.collection('products')
//           .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//           .then(result => {
//             console.log('Deleted');
//           })
//           .catch(err => {console.log(err);});
//       }

// }