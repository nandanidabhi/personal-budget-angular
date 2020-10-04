const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.use('/',express.static('public'));
app.get('/hello', (req, res) => {
    res.send('Hello Welcome to Nandani Tutotrial');
});

app.get('/budget', (req, res) => {
    fs.readFile('./budgetdata.json', 'utf-8', (err,data)=>{
        if(err) throw err;
        res.json(JSON.parse(data));
    }); 
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});