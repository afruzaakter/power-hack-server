const express = require('express');
const cors = require('cors');
const app = express();
require ('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6nu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
    await client.connect();
    const billCollection = client.db('power-hack').collection('bill');

    
    app.post('/bill', async (req, res) => {
        const bill = req.body;
        // console.log(purchase)
        const result = await billCollection.insertOne(bill);
        res.send(result);
        // console.log(result);
    });

    app.get('/bill', async(req, res) =>{
        const query ={};
        const cursur = billCollection.find(query);
        const bill = await cursur.toArray();
        res.send(bill);
    })

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