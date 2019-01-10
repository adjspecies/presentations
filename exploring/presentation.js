(function() {
  // Start impress.
  window.presentation = window.presentation || {};
  window.presentation.impress = impress();
  window.presentation.impress.init();

  // Enable rotate controls.
  const overview = document.querySelector('#overview');
  const rotateControls = document.querySelector('#rotate-controls');
  const rotateX = rotateControls.querySelector('.rotateX');
  const rotateY = rotateControls.querySelector('.rotateY');
  const rotateZ = rotateControls.querySelector('.rotateZ');
  rotateX.addEventListener('input', evt => {
    overview.dataset.rotateX = evt.target.value;
    window.presentation.impress.goto(overview, 0);
  });
  rotateY.addEventListener('input', evt => {
    overview.dataset.rotateY = evt.target.value;
    window.presentation.impress.goto(overview, 0);
  });
  rotateZ.addEventListener('input', evt => {
    overview.dataset.rotateZ = evt.target.value;
    window.presentation.impress.goto(overview, 0);
  });
  if ("ontouchstart" in document.documentElement) {
    document.querySelector(".hint").innerHTML = "<p>Swipe left or right to navigate</p>";
  }

  // Fetch remote data, defaulting to local data.
  window.presentation.fetchWithDefault = (url, defaultUrl, resolve) => {
    d3.json(url)
      .then(resolve)
      .catch(error => {
        console.error('Remote fetch failed, attempting local', error);
        d3.json(defaultUrl)
          .then(resolve);
      });
  };
})();
