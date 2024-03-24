const express = require('express');
const router = require('./src/routes')

const app = express();

app.use(express.json());
app.use(router);

const port = 3000;

app.get('/',(req,res)=>{
 res.send("Hello World")
})

app.listen(port,()=>{
    console.log(`App is running on ${port}`);
})