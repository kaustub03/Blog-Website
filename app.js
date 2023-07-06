//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const methodOverride = require('method-override')
const mongoose = require("mongoose");
mongoose.set('strictQuery', true); 
mongoose.connect("mongodb+srv://kaustubsreekrishnan:FWw83vy7vU4r4MUL@cluster0.cdhngby.mongodb.net/?retryWrites=true&w=majority");

const homeStartingContent = "Hi! Welcome to the daily journal. Feel free to post anything by going to the compose tab.";
const aboutContent = "This is a blog website made as my first full stack web application using Node and MongoDB.";
const contactContent = "React out to me if you have some suggestions regarding my website or if you just want to talk about tech in general.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const posts = [];

const postSchema = {
  title : String,
  content : String
};
const Post = mongoose.model("Post",postSchema)

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    res.render("home",{homeStartingContent:homeStartingContent,posts:posts});
  })
});

app.get("/about",function(req,res){
  res.render("about",{aboutContent:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contactContent:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const post = new Post({
    title : req.body.postTitle,
    content : req.body.postBody
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
 
  });
  // const post = {
  //   postTitle : req.body.postTitle,
  //   postBody : req.body.postBody
  // };
  //posts.push(post);
});

app.get("/posts/:postID",function(req,res){
  postID = req.params.postID;
  Post.findOne({_id : postID},function(err,foundPost){
    res.render("post",{post : foundPost});
  })
  // posts.forEach(function(post){
  //   if(_.lowerCase(post.postTitle) === _.lowerCase(req.params.topic)){
  //     res.render("post",{post : post});
  //   }
  // });
})

app.use(methodOverride('_method'));

app.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    await Post.findByIdAndRemove(postId);
    res.redirect('/'); // Redirect to the list of posts or any other desired page
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while deleting the post.');
  }
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
