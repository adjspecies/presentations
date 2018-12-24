(function() {
  window.presentation = window.presentation || {};
  window.presentation.e621 = {
    stub_enter: () => {},
    _leave: () => delete(window.presentation.e621)
  }
})();
