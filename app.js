const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require("cors");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//schemas
const userScehma = require('./newUser');
const noteSchema = require('./newNote');
///auth JS
const authJS = require('./Auth');
////////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
  origin: '*'
}));

mongoose_URL = "mongodb://Hamilton:l5wCvJ84dpvziPDj@ac-vtyxu56-shard-00-00.1xwupex.mongodb.net:27017,ac-vtyxu56-shard-00-01.1xwupex.mongodb.net:27017,ac-vtyxu56-shard-00-02.1xwupex.mongodb.net:27017/TODO?ssl=true&replicaSet=atlas-10oyf9-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(mongoose_URL)
.then(()=>{
  console.log('connected to database');
})
.catch((error)=>{
  console.log('connection failed')
  console.log(error)
})
//API endpoints

app.post('/api/newUser',(req,res)=>{
    bcrypt.hash(req.body.password ,10).then(hash =>{
      const sch = new userScehma({
        fname:req.body.fname,
        lname:req.body.lname,
        email:req.body.email,
        password:hash
    });
    sch.save();
    res.status(201).json({
      message:'Frontend : new user created succesfully'
    })
    console.log(' Backend : User was created sucessfully');
    })

})

// app.post('/api/checkUser',(req,res)=>{
// //   User.findOne({age: {$gte:5} })
// //  .then((docs)=>{
// //      console.log("Result :",docs);
// //  })
// //  .catch((err)=>{
// //      console.log(err);
// //  });


//   email=req.body.email;
//   password=req.body.password;
//   userScehma.findOne({ email: email})
//   .then((doc)=>{
//     bcrypt.compare(req.body.password,doc.password)
//     .then(result=>{
//       if(!result){
//         res.json({
//           message:'Authentication failed',
//           Auth:false
//         });
//         return;
//       }
//    const token = jwt.sign({email:doc.email},'Secret-Thing',{expiresIn:"1h"});
//         res.status(200).json({
//           token:token,
//           message:'User is Authenticated and token is received!',
//           name:doc.fname,
//           Auth:true,
//           email:doc.email,
//           expiresIn:3600
//         })
// })
//   })
//   .catch((err)=>{
//     console.log('Token error');
//     console.log(err)
//   })

// })

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
          message: 'User is Authenticated and token is received!',
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


app.post('/api/newNote',(req,res)=>{
  authJS
  console.log(req.body.archive)
  const sch = new noteSchema({
      title:req.body.title,
      content:req.body.content,
      email:req.body.email,
      time:req.body.time,
      archive:req.body.archive
  });
  sch.save();
  res.status(201).json({
    message:"note Added sucessfully!(from backend)"
  });
  console.log("Backend : note added sucessfully");
})


// app.get('/api/getNotes',(req,res)=>{
//   authJS
//   noteSchema.find().then(doc=>{
//     res.status(200).json({
//       message:'posts fetched sucessfully',
//       array:doc
//     })
//   })
//   console.log("Backed:post Added Sucessfully!");
// })

app.get('/api/getNotes',(req,res)=>{
  authJS
  const email = req.query.email;
  console.log(email)
  noteSchema.find({ email: email ,archive: '0'}).then(doc=>{
    res.status(200).json({
      message:'posts fetched sucessfully',
      array:doc
    })
  })
  console.log("Backed:post Added Sucessfully!");
})

// app.delete('/api/deleteNote/:id',(req,res)=>{
//   authJS
//   noteSchema.deleteOne({_id:req.params._id}).then((result)=>{
//     console.log(result);
//     console.log(req.params.id);
//   res.status(200).json({
//       message : 'Frontend : note deleted succesfully'
//   })
// })

// console.log('Backend : note deleted succesfully')
// })

app.delete('/api/deleteNote/:id', (req, res) => {
  authJS // assuming this is a valid function
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


app.put('/api/updateNote/:id',(req,res)=>{
  authJS
  console.log(req.body.title);
  const updatedNote = ({
    title:req.body.title,
    content:req.body.content,
    email:req.body.email,
    time:req.body.time,
    archive:req.body.archive
  });
  noteSchema.updateOne({_id:req.params.id},updatedNote)
  .then(result=>{
    console.log(result)
    res.status(200).json({
      message:'Frontend : note updated sucessfully !'
    })
  })
  console.log('Backend : note updated sucessfully !')
})


app.get('/api/getArchiveNotes',(req,res)=>{
  authJS
  const email = req.query.email;
  console.log(email)
  noteSchema.find({ email: email ,archive: '1'}).then(doc=>{
    res.status(200).json({
      message:'posts fetched sucessfully',
      array:doc
    })
  })
  console.log("Backed:post Added Sucessfully!");
})


/////////////////////////////////////////////////////////////////////////
//use this if you mess up
const PORT = process.env.PORT || 3000;
//server
app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running,and App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
);


////////////////////////////////////////////////////////////////////////////////////////////
//adding web socket


