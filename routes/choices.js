var async = require('async');

exports.list = function(req, res) {
  req.db.choices.find({}).sort({
    name: 1
  }).exec(function(err, choices) {
    res.render('choices/list', {
      choices: choices
    });
  });
};

exports.form = function(req, res) {
  async.waterfall([

    function(callback) {
      req.db.choices.findOne({
        _id: req.params.id
      }).exec(function(err, choice) {
        callback(null, choice);
      });
    },
    function(choice, callback) {
      if (!choice) {
        choice = {
          _id: 0
        };
      }
      res.render('choices/form', {
        choice: choice
      });
    }
  ]);
};

exports.save = function(req, res) {
  var choice = {
    name: req.body.choice.name
  };

  req.db.choices.update({
    _id: req.params.id
  }, choice, {
    upsert: true
  }, function(err, numReplaced, choice) {
    res.redirect('/choices');
  });
};


exports.vote = function(req, res) {
  var date = new Date(),
    today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  /* Find today's battle */
  req.db.battles.findOne({
    date: today
  }, function(err, battle) {
    var isValid = false;

    /* Validate that the choice is in today's battle */
    for (i = 0; i < battle.choices.length; i++) {
      if (req.params.id === battle.choices[i]._id) {
        isValid = true;
      }
    }

    if (isValid) {
      var vote = {
        ip: req.ip,
        battle: battle._id,
        choice: req.params.id
      };

      req.db.votes.update({
        ip: vote.ip,
        battle: vote.battle
      }, vote, {
        upsert: true
      }, function(err, numReplaced, choice) {
        res.json({
          success: true
        });
      });
    }
  });
};
