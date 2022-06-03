const express = require('express');
const router = express.Router();

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
require('dotenv').config();
const mongoURI = process.env.DB_URI;

const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        // crypto.randomBytes(16, (err, buf) => {
        //   if (err) {
        //     return reject(err);
        //   }
        // });
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    }
});

const upload = multer({ storage });


router.get(['/', '/home'], (req, res) => {
    res.render('home');
});

router.get('/course-1', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          return res.render("course-1", {videos: false})
        }
        
        // Files exist
        // console.log(files);
        const videos = [];
        files.map(file => {
            if (file.contentType === 'video/x-matroska' || file.contentType === 'video/mp4' || file.contentType === 'video/webm' || file.contentType === 'video/ogg' || file.contentType === 'video/quicktime' || file.contentType === 'video/avi') {
                videos.push(file);
          }
        });
        res.render('course-1', { videos: videos });
        // return res.json(files);
    });
    // res.render('course-1');
});

router.get('/course-2', (req, res) => {

    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          return res.render("course-2", {pdfs: false})
        }
        
        // Files exist
        // console.log(files);
        const pdfs = [];
        files.map(file => {
          if(file.contentType === 'application/pdf') {
            pdfs.push(file);
          }
        });
        res.render('course-2', { pdfs: pdfs });
        // return res.json(files);
    });
    // res.render('course-2');
});

router.get('/course-3', (req, res) => {
    res.render('course-3');
});

router.get('/teachers', (req, res) => {
    res.render('teachers');
});

router.get('/blog', (req, res) => {
    res.render('blog');
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});

module.exports = router;