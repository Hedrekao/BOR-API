var createError = require('http-errors');
var express = require('express');
var path = require('path');
const crypto = require('crypto')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const bodyParser =  require('body-parser')
var usersRouter = require('./routes/users');
var pastMatchesRouter = require('./routes/pastMatchesAPI');
var futureMatchesRouter = require('./routes/futureMatchesAPI');
const postsRouter = require('./routes/posts');
require('dotenv').config()

//initializing database

const mongoose = require('mongoose')


 mongoose.connect(process.env.DATABASE_CONNECTION, () => {
  console.log('connected to database')
})

const conn = mongoose.connection

let gfs, gridfsBucket

conn.once('open', () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos'
  });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

const storage = new GridFsStorage({
  url: process.env.DATABASE_CONNECTION,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'photos'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

var app = express();

app.use(bodyParser.json())
app.use(methodOverride('_method'))


app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/usersCredentials', usersRouter);
app.use('/pastMatches', pastMatchesRouter)
app.use('/futureMatches', futureMatchesRouter)
app.use('/posts', postsRouter)


app.post('/images', upload.single('file'), (req, res) => {
  console.log('image was uploaded')
  res.json({ message: "image was uploaded" })
})

app.get('/images/:filename',  (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readStream = gridfsBucket.openDownloadStream(file._id);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  }); 
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;