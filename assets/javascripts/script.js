(function() {
  'use strict';

  function addEvent(element, e, callback) {
    if (element.attachEvent)
      return element.attachEvent('on' + e, callback);
    else
      return element.addEventListener(e, callback, false);
  }

  addEvent(document.getElementById('battle'), 'click', function(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();

      var vote = e.target,
        http = new XMLHttpRequest();

      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          var choices = vote.parentNode.parentNode.childNodes;

          /* Clear 'selected' class from all choices */
          for (var i = 0; i < choices.length; i++) {
            choices[i].classList.remove('selected');
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
