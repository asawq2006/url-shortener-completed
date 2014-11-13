(function(window, document, undefined) {
  var ul = document.getElementsByTagName('ul')[0];
  var topBar = document.getElementById('top-bar');

  /* Displays a short link when a code is clicked. */
  ul.addEventListener('click', function(event) {
    // if code is clicked, display short link in the top bar
    if (event.target.nodeName === 'A') {
      var codeLink = event.target;
      topBar.textContent = 'Short link: ' + codeLink.href;
      event.preventDefault();
    }
  });

  var shortCodesTemplate = document.getElementById('short-codes-template');
  var renderShortCodes = Handlebars.compile(shortCodesTemplate.innerHTML);

  /* Renders the initial codes. */
  var request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    if (request.status === 200) {
      var shortCodes = JSON.parse(request.responseText);
      ul.innerHTML = renderShortCodes({ shortCodes: shortCodes });
    }
  });

  request.open('GET', '/short-codes', true);
  request.send();

  /* Adds a new code. */
  var addShortCodeForm = document.getElementById('add-short-code-form');
  addShortCodeForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var url = addShortCodeForm.url.value;
    if (!url) {
      return;
    }

    var request = new XMLHttpRequest();
    request.addEventListener('load', function() {
      if (request.status === 200) {
        var shortCodes = JSON.parse(request.responseText);
        ul.innerHTML = renderShortCodes({ shortCodes: shortCodes });
      }
    });

    request.open('POST', '/short-codes', true);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify({ url: url }));
  });
})(this, this.document);
