const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@traversymedia.a77qb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('Connected to Database');

      const database = client.db("carMechanics");
      const servicesCollection = database.collection("services");

      // GET API
      app.get('/services', async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
      });

      // GET Single Service
      app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        console.log('Getting the service id: ', id)
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        // console.log(service);
        res.json(service);
      });

      // POST API
      app.post('/services', async(req, res) => {
        // create a document to insert
        const service = req.body;
        console.log('hit the pots API', service);

        const result = await servicesCollection.insertOne(service);

        console.log(result);
        // console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.json(result);
      });

      // DELETE API 
      app.delete('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
      })

    } finally {
    //   await client.close();
    }
  }

  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Running Genius Server On Port: ', port)
})