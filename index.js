const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID =require('mongodb').ObjectID;
// const { ObjectID } = require('bson');
const port = process.env.PORT || 4000;



app.use(cors())
app.use(express.json());
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gaubw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("boiwala").collection("books");

  app.get('/books' , (req,res) =>{
    bookCollection.find()
    .toArray( (err , documents) =>{
      res.send(documents)
    })
  })
 


  app.post('/addBook', (req,res) =>{
        const newBook = req.body;
        bookCollection.insertOne(newBook)
        .then(result =>{
          res.send(result.insertedCount > 0)
        })
    
      })

  app.delete('/deleteBook/:id', (req,res) =>{
    const id =ObjectID(req.params.id)
    bookCollection.findOneAndDelete({_id:id})
    .then(documents => res.send(!!documents.value))
  })
      console.log('database connected successfully')
 
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)