/**
 * impress.js addclass addon
 *
 * This addon adds a requested class to the body on slide change.
 */
(function(document, window) {
  const enter = function(evt) {
    if (evt.target.dataset.addclasses) {
      const classes = evt.target.dataset.addclasses.split(' ');
      classes.forEach(d => document.body.classList.add(d));
    }
  };

  const leave = function(evt) {
    if (evt.target.dataset.addclasses) {
      const classes = evt.target.dataset.addclasses.split(' ');
      classes.forEach(d => document.body.classList.remove(d));
    }
  };

  document.addEventListener('impress:stepenter', enter);
  document.addEventListener('impress:stepleave', leave);
})(document, window);
