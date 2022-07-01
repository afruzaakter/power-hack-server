const express = require('express');
const cors = require('cors');
const app = express();
require ('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6nu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
    await client.connect();
    const billCollection = client.db('power-hack').collection('bill');

    //post api
    app.post('/bill', async (req, res) => {
        const bill = req.body;
        // console.log(purchase)
        const result = await billCollection.insertOne(bill);
        res.send(result);
        // console.log(result);
    });

    //get api

    app.get('/bill', async(req, res) =>{
        const query ={};
        const cursur = billCollection.find(query);
        const bill = await cursur.toArray();
        res.send(bill);
    })

    //delete
     app.delete('/bill/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await billCollection.deleteOne(query);
        res.send(result);
     })
     //update
     app.put('/bill/:id', async(req, res) =>{
        const id = req.params.id;
        // console.log(id);
        const update = req.body;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
            $set: {
                name: update.name,
                email: update.email,
                phone: update.phone,
                amount: update.amount,
                
            }
        };     
        const result = await billCollection.updateOne(filter, updateDoc, options);
        res.send(result);

    });

   } 
   finally{

   }
}
run().catch(console.dir);




app.get('/',(req,res) =>{
    res.send('Look me I can code node now')
})
app.listen(port, () =>{
    console.log("Listening to port",port);
})