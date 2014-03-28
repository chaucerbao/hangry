(function() {
  'use strict';

  function addEvent(element, e, callback) {
    if (element.attachEvent) {
      return element.attachEvent('on' + e, callback);
    } else {
      return element.addEventListener(e, callback, false);
    }
  }

  addEvent(document.getElementById('battle'), 'click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();

      var vote = e.target,
        http = new XMLHttpRequest();

      http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
          var choices = vote.parentNode.parentNode.childNodes,
            votes = JSON.parse(http.responseText);

          /* Clear 'selected' class from all choices and update vote counts */
          for (var i = 0; i < choices.length; i++) {
            /* Remove the 'selected' class */
            choices[i].classList.remove('selected');

            /* Update the count */
            for (var j = 0; j < votes.length; j++) {
              if (choices[i].childNodes[0].href.match(new RegExp(votes[j].choice + '$'))) {
                choices[i].childNodes[0].childNodes[1].innerHTML = votes[j].count;
                continue;
              }
            }
          }

          /* Add 'selected' class to the choice that was picked */
          vote.parentNode.classList.add('selected');
        }
      };

      http.open('GET', vote.href, true);
      http.send();
    }
  });
}());
