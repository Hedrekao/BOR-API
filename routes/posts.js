var express = require('express')
var router = express.Router()
const Post = require('../models/Post')


router.get('/', async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.json(posts)
    }
    catch (e) {
        res.json({ message: e.message })
    }
})

router.delete('/', async (req, res) => {
    if (process.env.API_KEY == req.body.api_key) {
        await Post.deleteOne({ _id: req.body._id })
    }       
})

router.delete('/:id', async (req, res) => {
    if (process.env.API_KEY == req.body.api_key) {
        await Post.deleteOne({ _id: req.params.id })
    }
})

router.patch('/', async (req,res) => {
    if (process.env.API_KEY == req.body.api_key) {
    const post = await Post.findById(req.body._id)
    post.title = req.body.title != '' && req.body.title != undefined ? req.body.title : post.title
    post.content = req.body.content != '' && req.body.content != undefined ? req.body.content : post.content
    await post.save()
    }
})

// router.post('/', async (req, res) => {

//     if(process.env.API_KEY == req.body.api_key)
//     {
//         try {


//     const post = new Post({ title: req.body.title, content: req.body.content })
    
//         await post.save()
//         console.log(post)

//     }
//     catch (e) {
//         res.json({ message: e.message })
//     }
//     }
    
// })

router.get('/:id', async (req, res, next) => {
    try {
        const posts = await Post.find({"_id": req.params.id});
        res.json(posts)
    }
    catch (e) {
        res.json({ message: e.message })
    }
})

module.exports = router