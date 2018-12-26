(function() {
  const domsubVis = _data => {
    // Visualization size.
    const width = 720;
    const chartWidth = 720 / 3;
    const height = 600;

    // Add SVG.
    const vis = d3.select('#interests__domsub')
      .append('svg')
      .attr('width', width)
      .attr('height', height + 100);

    // Grouping elements for the three subsets.
    const sexual = vis.append('g')
      .classed('sexual', true);
    const romantic = vis.append('g')
      .classed('romantic', true)
      .attr('transform', `translate(${chartWidth}, 0)`);
    const social = vis.append('g')
      .classed('social', true)
      .attr('transform', `translate(${chartWidth * 2}, 0)`);

    /**
     * Build a bar graph for a given subset.
     */
    const barGraph = (el, subset, key) => {
      // Scale for current values.
      const scale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(subset))])
        .range([0, height - 100]);
      const graphWidth = chartWidth * 0.85;
      const barWidth = graphWidth / 6;

      // Add bars and labels one by one because it was easy when I first wrote
      // this and now I'm too lazy to change it.
      el.append('rect')
        .attr('fill', '#088')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['-2']))
        .attr('x', 0)
        .attr('y', height - 100 - scale(subset['-2']));
      el.append('text')
        .text('Very submissive')
        .attr('y', barWidth * 0.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      el.append('rect')
        .attr('fill', '#286')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['-1']))
        .attr('x', barWidth)
        .attr('y', height - 100 - scale(subset['-1']));
      el.append('text')
        .text('Somewhat submissive')
        .attr('y', barWidth * 1.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      el.append('rect')
        .attr('fill', '#484')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['0']))
        .attr('x', barWidth * 2)
        .attr('y', height - 100 - scale(subset['0']));
      el.append('text')
        .text('Switch')
        .attr('y', barWidth * 2.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      el.append('rect')
        .attr('fill', '#682')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['1']))
        .attr('x', barWidth * 3)
        .attr('y', height - 100 - scale(subset['1']));
      el.append('text')
        .text('Somewhat dominant')
        .attr('y', barWidth * 3.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      el.append('rect')
        .attr('fill', '#860')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['2']))
        .attr('x', barWidth * 4)
        .attr('y', height - 100 - scale(subset['2']));
      el.append('text')
        .text('Very dominant')
        .attr('y', barWidth * 4.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      el.append('rect')
        .attr('fill', '#820')
        .attr('width', barWidth * 0.9)
        .attr('height', scale(subset['none']))
        .attr('x', barWidth * 5)
        .attr('y', height - 100 - scale(subset['none']));
      el.append('text')
        .text('No answer')
        .attr('y', barWidth * 5.5)
        .attr('x', 95 - height)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '10pt');

      // Label for the subset.
      el.append('text')
        .text(key)
        .attr('y', height + 90)
        .attr('x', graphWidth / 2)
        .attr('text-anchor', 'middle');
    };

    // Get the subset.
    _data = _data.dom_sub;

    // Generate the mean of the two years.
    const data = _data['2016'];
    Object.keys(data).forEach(k => {
      Object.keys(data[k]).forEach(o => {
        data[k][o] = (data[k][o] + _data['2015'][k][o]) / 2;
      });
    });

    // Build a bar chart for each subset.
    barGraph(sexual, data.sexual, 'sexual');
    barGraph(romantic, data.romantic, 'romantic');
    barGraph(social, data.social, 'social');
  };

  window.presentation = window.presentation || {};
  window.presentation.interests = {
    _enter: () => d3.json('vis/furrysurvey/interests/data.json').then(domsubVis),
    _leave: () => delete(window.presentation.interests)
  }
})();
