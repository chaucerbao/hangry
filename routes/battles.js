var async = require('async');
var shuffle = require('knuth-shuffle').knuthShuffle;

exports.today = function(req, res) {
  var date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  req.db.battles.findOne({
    date: today
  }, function(err, battle) {
    async.parallel([

        /* Create a battle if necessary */
        function(callback) {
          if (!battle) {
            /* Create today's battle */
            req.db.choices.find({}).exec(function(err, choices) {
              deck = shuffle(choices);

              battle = {
                date: today,
                choices: []
              };

              for (i = 0; i < 3; i++) {
                battle.choices.push(deck[i]);
              }

              req.db.battles.insert(battle);
              callback(null, battle);
            });
          } else {
            callback(null, battle);
          }
        },

        /* Get the user's previous selection (if available) */
        function(callback) {
          req.db.votes.findOne({
            ip: req.ip,
            battle: battle._id
          }, function(err, vote) {
            callback(null, vote);
          });
        }
      ],

      function(err, results) {
        res.render('battles/today', {
          battle: results[0],
          vote: results[1]
        });
      });
  });
};
