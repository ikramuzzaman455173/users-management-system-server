const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 4000
const cors = require('cors');
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1 align="center"style="font-size:20px;margin:10px 0;color:#333;">Users Management Server Is Runnings</h1>')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izhktyr.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("usersManagementDb").collection('usersManagement');

    app.get('/users', async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    })

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const newUser = req.body
      // console.log(newUser);
      const result = await usersCollection.insertOne(newUser);
      res.send(result)
    })

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id
      const updateUser = req.body
      // console.log(updateUser,id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUserDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          status: updateUser.status,
          gender:updateUser.gender
        },
      };
      const result = await usersCollection.updateOne(filter, updateUserDoc, options);
      res.send(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id
      const query={_id:new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`The Server Is Running On Port: http://localhost:${port}/`);
})
