(function() {
  const kinks = data => {

  };
  
  window.presentation = window.presentation || {};
  window.presentation.interests = {
    _enter: () => d3.json('vis/furrysurvey/interests/data.json').then(kinks),
    _leave: () => delete(window.presentation.interests)
  }
})();
