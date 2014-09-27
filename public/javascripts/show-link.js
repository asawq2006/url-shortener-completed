(function(window, document, undefined) {
  var ul = document.getElementsByTagName('ul')[0];
  var topBar = document.getElementById('top-bar');

  ul.addEventListener('click', function(event) {
    // if code is clicked, display short link in the top bar
    if (event.target.nodeName === 'A') {
      var codeLink = event.target;
      topBar.textContent = 'Short link: ' + codeLink.href;
      event.preventDefault();
    }
  });
})(this, this.document);
