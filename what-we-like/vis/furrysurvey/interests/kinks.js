(function() {
  const kinkVis = _data => {
    // Grab only the interests
    _data = _data.interests;

    // Start by grabbing just 2016
    const data = _data['2016']

    // Get kinks and options
    const kinks = Object.keys(data);
    const options = Object.keys(data[kinks[0]]).filter(d => d != 'year');

    // Average the two years' values.
    kinks.forEach(k => {
      options.forEach(o => {
        data[k][o] = (data[k][o] + _data['2015'][k][o]) / 2;
      });
    });

    // Sort kinks by popularity.
    kinks.sort((a, b) => data[b]['interested'] - data[a]['interested']);

    // Calculate max, mean, and std dev for each option.
    const meta = {sd: {}, mean: {}, max: {}};
    options.forEach(d => {
      const vals = kinks.map(k => data[k]).map(o => o[d]);
      meta.sd[d] = d3.deviation(vals);
      meta.mean[d] = d3.mean(vals);
      meta.max[d] = d3.max(vals);
    });

    // Visualization size.
    const width = 800;
    const height = 720;

    // Add SVG element.
    const vis = d3.select('#interests__kinks')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Utilities for bar chart.
    const t = d3.transition().duration(500);
    const barScale = d3.scaleLinear()
      .domain([0, d3.max(Object.values(meta.max))])
      .range([0, height - 262]);
    const colorScale = d3.scaleOrdinal(d3.schemePurples[options.length]);

    // Group together bar chart stuff.
    const graphGroup = vis.append('g')
      .classed('kink-graph', true);

    // Bound elements for the bars themselves.
    const graph = graphGroup.append('g')
      .classed('bars', true);
    graph.selectAll('rect')
      .data([0, 0, 0, 0, 0])
      .enter()
      .append('rect')
      .attr('stroke-width', 2)
      .attr('x', (dd, i) => 310 + i * 73)
      .attr('y', height - 260)
      .attr('width', 70)
      .attr('height', 0)
      .style('opacity', 0.8);

    // Group for chart extras.
    const graphExtras = graphGroup.append('g')
      .classed('extra', true)
      .selectAll('g')
      .data(options)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${310 + i * 73}, 0)`);

    // Labels
    graphExtras.append('text')
      .text(d => d)
      .attr('x', 250 - height)
      .attr('y', 43)
      .attr('transform', 'rotate(-90)')
      .style('text-anchor', 'end')
      .style('font-size', '20px');

    // Whiskers (std dev and mean)
    graphExtras.append('path')
      .attr('d', d => `
      ${/* Make sure we don't move past the bottom of the bar */''}
      M 10 ${d3.min([
        height - 260,
        height - 260 - barScale(meta.mean[d]) + barScale(meta.sd[d])
      ])}
      l 50 0
      m -25 0
      ${/* As we may be less than one std dev from the mean, move absolutely */''}
      L 35 ${height - 260 - barScale(meta.mean[d]) + 2}
      c -4 0 -4 -4 0 -4
      c 4 0 4 4 0 4
      m 0 -4
      l 0 -${barScale(meta.sd[d]) - 2}
      m -25 0
      l 50 0
      `)
      .style('stroke', 'black')
      .style('opacity', 0.4)
      .style('stroke-width', '2px')
      .style('fill', 'none');

    // The list of kinks
    const kinkListGroup = vis.append('g')
      .classed('kink-list', true);
    const kinkList = kinkListGroup.selectAll('g')
      .data(kinks)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(50, ${i * 32})`);

    // Label
    kinkList.append('text')
      .text(d => d)
      .attr('x', 100)
      .attr('y', 18)
      .style('text-anchor', 'middle')
      .style('font-size', '12pt');

    // Rect goes over the label, and we just fiddle with opacity.
    kinkList.append('rect')
      .attr('class', d => d)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 30)
      .style('fill', '#55c')
      .style('opacity', 0.1)
      .on('mouseover', function() {
        const el = d3.select(this);
        if (el.classed('selected')) {
          return;
        }
        el.style('opacity', 0.2);
      })
      .on('mouseout', function() {
        const el = d3.select(this);
        if (el.classed('selected')) {
          return;
        }
        el.style('opacity', 0.1);
      })
      .on('click', function(d) {
        // Deselect previously selected kink.
        kinkList.selectAll('rect')
          .style('opacity', 0.1)
          .classed('selected', false);

        // Mark this one selected
        d3.select(this)
          .style('opacity', 0.3)
          .classed('selected', true);

        // Get the current object first
        const datumObj = data[d];
        delete datumObj['year'];

        // And then a list of the values.
        const datum = options.map(dd => datumObj[dd]);

        // Update the colors domain so that lighter colors are always bound to
        // the lowest values.
        colorScale.domain(Object.values(datumObj).sort((a, b) => a - b));

        // Update the bound elements.
        graph.selectAll('rect')
          .data(datum)
          .transition(t)
          .style('fill', dd => colorScale(dd))
          .style('stroke', dd => d3.rgb(colorScale(dd)).darker())
          .attr('y', dd => height - 260 - barScale(dd))
          .attr('height', dd => barScale(dd));
      });

    // Select 'furry' on load.
    kinkListGroup.select('.furry')
      .on('click')
      .call(kinkListGroup.select('.furry').node(), 'furry');
  };

  window.presentation = window.presentation || {};
  window.presentation.interests = {
    _enter: () => d3.json('vis/furrysurvey/interests/data.json').then(kinkVis),
    _leave: () => delete(window.presentation.interests)
  }
})();
