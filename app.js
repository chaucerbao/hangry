var express = require('express'),
  http = require('http'),
  path = require('path'),

  /* Database */
  Datastore = require('nedb'),
  db = {
    choices: new Datastore({
      filename: './db/choices.nedb',
      autoload: true
    }),
    battles: new Datastore({
      filename: './db/battles.nedb',
      autoload: true
    }),
    votes: new Datastore({
      filename: './db/votes.nedb',
      autoload: true
    })
  },

  /* Routes */
  choices = require('./routes/choices'),
  battles = require('./routes/battles'),

  /* Application */
  app = express();


/* Make database available to all routes */
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', battles.today);

app.get('/choices', choices.list);
app.get('/choice/:id', choices.form);
app.post('/choice/:id', choices.save);

app.get('/vote/:id', choices.vote);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
