 const express = require('express'); 
 const cors = require('cors');
 const bodyParser = require('body-parser')
 const fileUpload = require("express-fileupload");
 require("dotenv").config();
 const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5050 ;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvh8x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("service");
   console.log('databse connected successfully')

    app.post("/addService", (req, res) => {
      const file = req.files.file;
      const name = req.body.name;
      const desc = req.body.desc;
      const newImg = file.data;
      const encImg = newImg.toString("base64");

      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };

      serviceCollection.insertOne({ name, desc, image }).then((result) => {
        res.send(result.insertedCount > 0);
      });
    });


    app.get('/service', (req, res) => {
      serviceCollection.find({})	
      .toArray((arr, service) => {
        res.send(service)
      })
    });

});


app.get('/', (req, res) => {
  res.send('hello my servicing website api')	
});


app.listen(port);

