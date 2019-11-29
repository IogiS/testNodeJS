var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const  router  =  express.Router();


router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());




const MongoClient = require("mongodb").MongoClient;
app.set('views', './views');
app.set('view engine', 'ejs');
const url = "mongodb://localhost:27017/";



const Role = require('./model/role.model.js');
  
// Configuring the database
const config = require('./config/config.js');
const mongoose = require('mongoose');
 
mongoose.Promise = global.Promise;
 
// Connecting to the database
mongoose.connect(config.url)
.then(() => {
  console.log("Successfully connected to MongoDB.");    
  initial();
}).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();  
});



const mongoClient = new MongoClient('mongodb+srv://Logis:qazx1234@g-katalog-fb4bz.azure.mongodb.net/admin', { useNewUrlParser: true });
 var a;
mongoClient.connect(function(err, client){
      
    const db = client.db("g-katalogDB");
    const collection = db.collection("Games");
 
    if(err) return console.log(err);
      
    collection.find({name: "Metro 2033"}).toArray(function(err, results){
             a = results;    
        console.log(results);
        client.close();
    });
});


function initial(){
    Role.count( (err, count) => {
      if(!err && count === 0) {
        // USER Role ->
        new Role({
          name: 'USER'
        }).save( err => {
          if(err) return console.error(err.stack)
          console.log("USER_ROLE is added")
        });
   
        // ADMIN Role ->
        new Role({
          name: 'ADMIN'
        }).save( err => {
          if(err) return console.error(err.stack)
          console.log("ADMIN_ROLE is added")
        });
   
        // PM Role ->
        new Role({
          name: 'PM'
        }).save(err => {
          if(err) return console.error(err.stack)
          console.log("PM_ROLE is added")
        });
      }
    });
  }

app.get('/main', (req, res) => {
        res.render('main', {
           // title: a[0].name,
            emails: a
     });
     console.log(a);
    });
    
 app.get('/', function(req,res){res.sendFile(__dirname + '/public/index.html');})
 
 router.post('/register', (req, res) => {
    res.status(200).send({ access_token:  '' });
});

router.post('/login', (req, res) => {
    res.status(200).send({ access_token:  '' });
});

app.use(function(err, req, res, next) {
    res.status(500).json(err);
  });



 app.listen(process.env.PORT || 3000)