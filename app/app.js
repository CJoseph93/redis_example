const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

//create redis client
let client = redis.createClient(3000, '127.0.0.1');

client.on('connect', function() {
  console.log('connected to redis...');
});

//set port
const port = 3000;
//init app
const app = express();


app.engine('handlebars', exphbs.engine({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// method override
app.use(methodOverride('_method'));

//search page
app.get('/', function(req, res, next){
  res.render('searchusers');
});

//search processing
app.post('/user/search', function(req, res, next) {
  let id = req.body.id;
  
  client.hgetall(id, function(err, obj) {
    if(!obj) {
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      obj.id = id;
      res.render('details', {
        user: obj
      });
    }
  });
});

app.listen(port, function() {
  console.log('server started on port ' + port);
});
