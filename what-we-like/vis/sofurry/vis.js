(function() {
  window.presentation = window.presentation || {};
  window.presentation.sofurry = {
    stub_enter: () => {},
    _leave: () => delete(window.presentation.sofurry)
  }
})();
