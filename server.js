const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mean-blog');

//Schema for Mongo
var PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: String,
    tag: {
        type: String,
        enum: ['Technology', 'Economy', 'Sports', 'Education']
    },
    posted: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'post'
});
//naming the collection; if remove this auto collection created


//Model for interaction with DB
//will create instances of model that we submit based on PostSchema
var PostModel = mongoose.model("PostModel", PostSchema);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post("/api/blogPost", postBlog);
app.get("/api/blogPost", getAllPosts);
app.delete("/api/blogPost/:id", deletePost);

function deletePost(req, res) {
    var postId = req.params.id;
    // PostModel.remove({}); This line will remove all posts. Be careful.
    PostModel.remove({_id: postId}).then(function (status) {
        res.sendStatus(200);
    }, function () {
        res.sendStatus(400);
    });
}

function getAllPosts (req, res) {
    PostModel.find().then(function (posts) {
        res.json(posts);
    }, function (err) {
        res.sendStatus(400);
    });
}

function postBlog(req, res) {
    var post = req.body;
    console.log(post);
    //take in post and create a model to be submitted to DB
    PostModel.create(post).then(function(postObj) {
        //sending back the obj to client is not useful
        // res.json(postObj);
        res.json(200);
    }, function(error) {
        console.log(error);
        res.sendStatus(400);
    });

    //Synchronous call like this can cause race conditions, trying to access res as soon as it is submitted
    //Use Asynchronous calls like above:::Promises; Below code may not run in Production
    // PostModel.create(post);
    // res.json(post);
}

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
