const mongoose = require('mongoose');
const {marked} = require('marked');  //converts our markdown into html
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
// this essentially purifies our html with the help of JSDOM().window;
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    markdown : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : () => Date.now()
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    sanitizedHtml:{
        type:String,
        required:true
    }
})


// this is gonna run everytime we try to create a new article or you run http methods
articleSchema.pre('validate',function(next){
    if (this.title){
        this.slug = slugify(this.title,{lower:true,strict:true})
    }

    if(this.markdown){
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown)); //converts our markdown to our html and purifies it of any malicious code 
    }
    next();
})

module.exports = mongoose.model('Article',articleSchema);