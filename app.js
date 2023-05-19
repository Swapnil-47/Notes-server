const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//schemas
const userScehma = require('./newUser');
const noteSchema = require('./newNote');
///auth JS
const authJS = require('./Auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
  origin: '*'
}));

mongoose_URL = "mongodb://Hamilton:l5wCvJ84dpvziPDj@ac-vtyxu56-shard-00-00.1xwupex.mongodb.net:27017,ac-vtyxu56-shard-00-01.1xwupex.mongodb.net:27017,ac-vtyxu56-shard-00-02.1xwupex.mongodb.net:27017/TODO?ssl=true&replicaSet=atlas-10oyf9-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose.connect(mongoose_URL)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.log('Connection failed');
    console.log(error);
  });

app.post('/api/newUser', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const sch = new userScehma({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: hash
    });
    sch.save();
    res.status(201).json({
      message: 'Frontend: New user created successfully'
    });
    console.log('Backend: User was created successfully');
  });
});

app.post('/api/checkUser', (req, res) => {
  email = req.body.email;
  password = req.body.password;
  userScehma.findOne({ email: email })
    .then((doc) => {
      if (!doc) {
        res.json({
          message: 'User not found',
          Auth: false,
        });
        return;
      }
      bcrypt.compare(req.body.password, doc.password).then((result) => {
        if (!result) {
          res.json({
            message: 'Authentication failed',
            Auth: false,
          });
          return;
        }
        const token = jwt.sign({ email: doc.email }, 'Secret-Thing', {
          expiresIn: '1h',
        });
        res.status(200).json({
          token: token,
          message: 'User is authenticated and token is received!',
          name: doc.fname,
          Auth: true,
          email: doc.email,
          expiresIn: 3600,
        });
      });
    })
    .catch((err) => {
      console.log('Token error');
      console.log(err);
    });
});

app.post('/api/newNote', (req, res) => {
  authJS;
  console.log(req.body.archive);
  const sch = new noteSchema({
    title: req.body.title,
    content: req.body.content,
    email: req.body.email,
    time: req.body.time,
    archive: req.body.archive
  });
  sch.save();
  res.status(201).json({
    message: "Note added successfully! (from backend)"
  });
  console.log("Backend: Note added successfully");
});

app.get('/api/getNotes', (req, res) => {
  authJS;
  const email = req.query.email;
  console.log(email);
  noteSchema.find({ email: email, archive: '0' }).then(doc => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      array: doc
    });
  });
  console.log("Backend: Posts fetched successfully");
});

app.delete('/api/deleteNote/:id', (req, res) => {
  authJS;
  noteSchema.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log('Backend: Note deleted successfully:', result);
      res.status(200).json({ message: 'Backend: Note deleted successfully' });
    })
    .catch(error => {
      console.error('Backend: An error occurred while deleting note:', error);
      res.status(500).json({ message: 'Backend: An error occurred while deleting note' });
    });
});

app.put('/api/updateNote/:id', (req, res) => {
  authJS;
  console.log(req.body.title);
  const updatedNote = ({
    title: req.body.title,
    content: req.body.content,
    email: req.body.email,
    time: req.body.time,
    archive: req.body.archive
  });
  noteSchema.updateOne({ _id: req.params.id }, updatedNote)
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Frontend: Note updated successfully!'
      });
    });
  console.log('Backend: Note updated successfully!');
});

app.get('/api/getArchiveNotes', (req, res) => {
  authJS;
  const email = req.query.email;
  console.log(email);
  noteSchema.find({ email: email, archive: '1' }).then(doc => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      array: doc
    });
  });
  console.log("Backend: Posts fetched successfully");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is successfully running, and app is listening on port " + PORT);
  else
    console.log("Error occurred, server can't start", error);
});
