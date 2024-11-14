const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article')
const articleRouter = require('./routes/articles');
const methodOverride = require('method-override');
const { title } = require('process');
require('dotenv').config();
const app = express();


const port = 5000;

mongoose.connect('mongodb+srv://vivekpatel:X9CSYGQ5arKWqTTj@cluster2.a9wrh.mongodb.net/',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

.then(() => {
    console.log("your connection to the database was successfull")
})

.catch((err) => {
    console.error("Error connecting to the database..",err)
}) 


app.set('view engine','ejs');

// this is basically the bodyParser and it says that we can access all our form data with req.body
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'));


app.get('/',async (req,res) => {
    const articles = await Article.find().sort({createdAt : 'desc'});
    res.render('articles/index.ejs',{articles:articles});
})


app.use('/articles',articleRouter);

app.listen(port,() => {
    console.log(`your server is running on port ${port}..`)
});