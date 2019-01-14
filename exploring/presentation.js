(function() {
  // Start impress.
  window.presentation = window.presentation || {};
  window.presentation.impress = impress();
  window.presentation.impress.init();

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
