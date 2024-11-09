require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const product = require('./product.json')
const app = express();
app.use(cors())
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// jVXG60IR2nGX48xn
// jyaffa1233

app.get('/',(req,res)=>{
    res.send('hello world..');
})

app.get('/product',(req,res)=>{
    res.send(product);
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yt5hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const database = client.db("itemsDB").collection("items");
    app.get('/informa',async(req, res)=>{
      const cursor = database.find();
      const result = await cursor.toArray();
      res.send(result)

    })
    app.post('/products',async (req,res)=>{
        const data = req.body;
        console.log('port is hitting',data)
        const result = await database.insertOne(data);
        res.send(result)
    })

    app.delete('/informa/:id',async(req,res)=>{
       const id = req.params.id;
       console.log('place delte id',id)
       const query = {_id: new ObjectId(id)}
       const result = await database.deleteOne(query);
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


app.get('/product/:id',(req,res)=> {
    const id = req.params.id;
    const findId = product.find(abc => abc.id == id);
    res.send(findId);
})

app.listen(port,()=> {
    console.log(`port is running on port ${port}`);
})