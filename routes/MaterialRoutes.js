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

router.get('/', (req, res) => {
    // res.render('test', );
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.render('test', { files: false });
        }

        // Files exist
        else {
            files.map(file => {
              if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                file.isImage = true;
              } 
              else if(file.contentType === 'video/x-matroska' || file.contentType === 'video/mp4' || file.contentType === 'video/webm' || file.contentType === 'video/ogg' || file.contentType === 'video/quicktime' || file.contentType === 'video/avi') {
                file.isVideo = true;
              }
              else if(file.contentType === 'application/pdf') {
                //   console.log('pdf founddd');
                file.isPDF = true;
              }
              else if(file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
                file.isWord = true;
              }
            else if(file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'){
                    file.isPPT = true;
            }

            });
            res.render('test', { files: files });
        }
    });
});





// post a single file
router.post('/upload', upload.single('file'), (req, res) => {
    // res.json({ file: req.file });
    res.redirect('/material');
});

// get all files in json
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
        return res.status(404).json({
            err: 'No files exist'
        });
        }

        // Files exist
        // console.log(files);
        
        return res.json(files);
    });
});

// get single file in json
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });


  // get image
  router.get('/image/:filename', (req, res) => {
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
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
        // gfs.openDownloadStreamByName(file.filename).pipe(res);
        // console.log(file);
        // const readStream = gfs.openDownloadStreamByName(file.filename);
        // console.log(readStream);
        // res.json({status: 'filedounfound'});
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });


  // get video
  router.get('/video/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if video
      if (file.contentType === 'video/x-matroska' || file.contentType === 'video/mp4' || file.contentType === 'video/webm' || file.contentType === 'video/ogg' || file.contentType === 'video/quicktime' || file.contentType === 'video/avi') {
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an video'
        });
      }
    });
  });


    // get pdf
    router.get('/pdf/:filename', (req, res) => {
        // console.log('pdf roue');
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
          // Check if file
          if (!file || file.length === 0) {
            return res.status(404).json({
              err: 'No file exists'
            });
          }
      
          // Check if pdf
          if (file.contentType === 'application/pdf') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
          } else {
            res.status(404).json({
              err: 'Not an pdf'
            });
          }
        });
      });
      router.get('/word/:filename', (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists'
              });
            }
        
            // Check if docx
            if (file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              const readstream = gfs.createReadStream(file.filename);
              readstream.pipe(res);
            } else {
              res.status(404).json({
                err: 'Not as docxs'
              });
            }
          });
      });

      //ppt
      router.get('/ppt/:filename', (req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
              return res.status(404).json({
                err: 'No file exists'
              });
            }
        
            // Check if docx
            if (file.contentType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
              const readstream = gfs.createReadStream(file.filename);
              readstream.pipe(res);
            } else {
              res.status(404).json({
                err: 'Not as docxs'
              });
            }
          });
      });

      router.get('/notfound', (req, res) => {
        res.render('404');
      });
      router.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ err: err });
      }
  
      res.redirect('/material');
    });
  });

  module.exports = router;