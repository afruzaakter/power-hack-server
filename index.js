const express = require('express');
const cors = require('cors');
const app = express();
require ('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6nu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT token function
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

async function run(){
   try{
    await client.connect();
    const billCollection = client.db('power-hack').collection('bill');
    const userCollection = client.db('power-hack').collection('user');
    // const usersCollection = client.db('power-hack').collection('user');
    // const userCollection = client.db('power-hack').collection('users')

    //user post api
    app.post('/user', async (req, res) => {
        const user = req.body;
        // console.log(purchase)
        const result = await userCollection.insertOne(user);
        res.send(result);
        // console.log(result);
    });

    //token
    app.put('/user/:email', async(req, res) =>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email: email};
        const options = {upsert: true};
        const updateDoc = {
            $set: user,
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        const token = jwt.sign({email: email}, process.env.ACCESS_TOKEN,{expiresIn:'24h'});
        console.log(token)
        res.send({result, token})
    })

    //user get api
    app.get('/user', async(req, res) =>{
        const query ={};
        const cursur = userCollection.find(query);
        const user = await cursur.toArray();
        res.send(user);
    })
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