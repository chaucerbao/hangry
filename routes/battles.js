'use strict';

var async = require('async'),
  shuffle = require('knuth-shuffle').knuthShuffle,
  choicesPerBattle = 3;

exports.today = function(req, res) {
  var date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  req.db.battles.findOne({
    date: today
  }, function(err, battle) {
    async.series([

        /* Create a battle if necessary */
        function(callback) {
          if (!battle) {
            /* Create today's battle */
            req.db.choices.find({}).exec(function(err, choices) {
              var deck = shuffle(choices);

              battle = {
                date: today,
                choices: []
              };

              for (var i = 0; i < Math.min(deck.length, choicesPerBattle); i++) {
                deck[i].votes = [];
                battle.choices.push(deck[i]);
              }

              req.db.battles.insert(battle, function(err, battle) {
                callback(null, battle);
              });
            });
          } else {
            callback(null, battle);
          }
        },

        /* Get the user's previous selection (if available) */
        function(callback) {
          for (var i = 0; i < battle.choices.length; i++) {
            if (battle.choices[i].votes.indexOf(req.ip) >= 0) {
              callback(null, battle.choices[i]._id);
              return;
            }
          }
          callback(null, null);
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
