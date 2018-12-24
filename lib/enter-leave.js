(function() {
  window.presentation = window.presentation || {};

  const _run = (fnStr, evt) => {
    if (!fnStr) {
      return;
    }
    const fn = fnStr.split('.').reduce((m, d) => m[d] || {}, window);
    if (typeof fn !== 'function') {
      throw(`${fnStr} is not a function`);
    }
    fn(evt);
  }

  window.presentation.enter = function(evt) {
    const scriptSrc = evt.target.dataset.visSrc;
    const fnStr = evt.target.dataset.visFuncEnter;
    const id = evt.target.dataset.visId;
    const container = evt.target.querySelector('.vis-container');
    const placeholder = evt.target.querySelector('.placeholder');

    container.innerHTML = `<div id="${id}"></div>`;
    const script = document.createElement('script');
    script.src = scriptSrc;
    container.appendChild(script);

    if (placeholder) {
      placeholder.style.display = 'none';
    }

    script.onload = () => _run(fnStr, evt);
  };

  window.presentation.leave = function(evt) {
    const fnStr = evt.target.dataset.visFuncLeave;
    const placeholder = evt.target.querySelector('.placeholder');

    evt.target.querySelector('.vis-container').innerHTML = '';

    if (placeholder) {
      placeholder.style.display = 'block';
    }

    if (fnStr) {
      _run(fnStr, evt);
    }
  };
})();
