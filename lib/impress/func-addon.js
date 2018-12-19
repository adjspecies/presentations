/**
 * impress.js func addon
 *
 * This addon allows you specify a function to be called when you enter a step
 * as well as when you leave. You can specify these functions as dotted strings
 * like so:
 *
 *     <div class="step" data-func-enter="myLibrary.utils.setup"
 *             data-func-leave="myLibrary.utils.teardown" ...>
 *         ...
 *     </div>
 *
 * These functions receive the entire impress event as their sole argument.
 * From there, you will be able to access the step node to do whatever you
 * want.
 *
 * The original use-case for this was for a presentation that utilized data
 * visualizations built using d3. In order to prevent having to build all of
 * the visualizations on page load, possibly causing delays or intense memory
 * usage from so many nodes being added to the dom, the goal was to have the
 * visualization built when the step was entered, then garbage collected when
 * the step was left. To make sure that an overview of the presentation (á là
 * https://impress.js.org/#/overview ) didn't jus thave blank spots where the
 * visualizations were, a placeholder image was included. The result looked
 * looked something like:
 *
 *     function stepEnter(evt) {
 *       const node = d3.select(evt.target);
 *       node.select('.placeholder')
 *         .style('display', 'none');
 *       // set up visualization here...
 *     }
 *
 *     function stepLeave(evt) {
 *       const node = d3.select(evt.target);
 *       node.select('.placeholder')
 *         .style('display', 'block');
 *       // tear down visualization here...
 *     }
 *
 * Sure, I could have just included those images in my presentation and be
 * done with it, but that would mean losing the interactive or animated nature
 * of them, and that's no fun!
 */
(function(document, window) {
  const _run = (fnStr, evt) => {
    if (!fnStr) {
      return;
    }
    const fn = fnStr.split('.').reduce((m, d) => m[d || {}], window);
    if (typeof fn !== 'function') {
      throw(`${fnStr} is not a function`);
    }
    fn(evt);
  };

  const enter = (evt) => {
    _run(evt.target.dataset.funcEnter, evt);
  };

  const leave = (evt) => {
    _run(evt.target.dataset.funcLeave, evt);
  };

  document.addEventListener('impress:stepenter', enter);
  document.addEventListener('impress:stepleave', leave);
})(document, window);
