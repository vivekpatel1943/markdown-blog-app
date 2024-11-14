const express = require('express');
const Article = require('./../models/article')
const router = express.Router();
require('dotenv').config();


router.get('/new',(req,res) => {
    res.render("articles/new",{article:new Article()})
})

router.get('/edit/:id',async (req,res) => {
    const article = await Article.findById(req.params.id);
    res.render("articles/edit",{article:article})
})

// Single route for the hidden CRUD page. protected by the middleware
router.get('/super-secret-crud',verifySecretKey,async(req,res) => {
    try{
        const articles = await Article.find();
        if(!articles){
            return res.status(404).send('No articles found');
        }
        res.render('articles/crud.ejs',{articles:articles})
    }catch(err){
        console.error(err);
        return res.status(500).send('Internal server error')
    }
    
})

router.get('/:slug',async (req,res) => {
    const article = await Article.findOne({slug : req.params.slug});
    try{
        if(!article){
            return res.status(404).send('Article not found');  //Ensures no further code runs
        }
       
        res.render('articles/show',{ article : article })
    }catch(e){
        console.error(e);
        return res.status(500).send("server error"); //Ensures no further code runs
    }
   
})

router.post('/', async (req,res,next) => {
/*     let article = new Article({
        title : req.body.title, 
        description : req.body.description,
        markdown : req.body.markdown 
    })
    try{
        article = await article.save();
        res.redirect(`/articles/${article.slug}`)
    }catch(e){
        console.log(e)
        res.render('articles/new',{article:article})
    } */
    req.article = new Article();
    next();
},saveArticleAndRedirect('new'));

router.put('/:id',async( req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
},saveArticleAndRedirect('edit'));

router.delete('/:id',async (req,res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
})

function saveArticleAndRedirect(path){
    return async (req,res) => {
        let article = req.article;
        article.title =  req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown 
        
     
        try{
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        }catch(e){
            console.log(e)
            res.render(`articles/${path}`,{article: article})
        }
    } 
}   


 
// middleware to verify the secret key
function verifySecretKey(req,res,next){
    const secretKey = process.env.ADMIN_SECRET_KEY;
    const providedKey = req.query.admin_key;

    console.log(`secret key : ${secretKey}`);
    console.log(`provided key: ${providedKey}`);

    if(providedKey && providedKey === secretKey ){
        return next();
    }else{
        res.status(403).send('Forbidden: You do not have access to this page')
    }

} 



module.exports = router;

