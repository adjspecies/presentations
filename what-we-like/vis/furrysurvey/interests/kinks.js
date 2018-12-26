(function() {
  const kinkVis = data => {
    data = data.interests['2016'];
    const kinks = Object.keys(data);
    const options = Object.keys(data[kinks[0]]).filter(d => d != 'year');
    const meta = {sd: {}, mean: {}, max: {}};
    options.forEach(d => {
      const vals = kinks.map(k => data[k]).map(k => k[d]);
      meta.sd[d] = d3.deviation(vals);
      meta.mean[d] = d3.mean(vals);
      meta.max[d] = d3.max(vals);
    });
    let currentKink = '';

    const width = 800;
    const height = 720;
    const vis = d3.select('#interests__kinks')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const kinkListGroup = vis.append('g')
      .classed('kink-list', true);
    const graphGroup = vis.append('g')
      .classed('kink-graph', true);

    const kinkList = kinkListGroup.selectAll('g')
      .data(kinks)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 32})`);

    kinkList.append('text')
      .text(d => d)
      .attr('x', 100)
      .attr('y', 18)
      .style('text-anchor', 'middle')
      .style('font-size', '12pt');
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
        kinkList.selectAll('rect')
          .style('opacity', 0.1)
          .classed('selected', false);
        d3.select(this)
          .style('opacity', 0.3)
          .classed('selected', true);
        currentKink = d;
        buildChart();
      });

      const buildChart = () => {
        const datum = data[currentKink];
        delete datum['year'];
        const barScale = d3.scaleLinear()
          .domain([0, d3.max(Object.values(meta.max))])
          .range([0, height - 250]);
        // Going with options.length + 1 and the added -1 on the domain tricks
        // d3 into using the darker colors; lighter ones get lost on our bg.
        const colorScale = d3.scaleOrdinal(d3.schemePurples[options.length + 1])
          .domain([-1].concat(Object.values(datum).sort((x, y) => x - y)));
        graphGroup.html('');
        const graph = graphGroup.selectAll('g')
          .data(options)
          .enter()
          .append('g')
          .attr('transform', (d, i) => `translate(${310 + i * 73}, 0)`);

        graph.append('text')
          .text(d => d)
          .attr('x', -height + 250)
          .attr('y', 45)
          .attr('transform', 'rotate(-90)')
          .style('text-anchor', 'end')
          .style('fill', d => d3.rgb(colorScale(datum[d])).darker())
          .style('font-size', '20px');
        graph.append('rect')
          .attr('x', 0)
          .attr('y', d => height - 260 - barScale(datum[d]))
          .attr('width', 70)
          .attr('height', d => barScale(datum[d]))
          .style('fill', d => colorScale(datum[d]))
          .style('stroke', d => d3.rgb(colorScale(datum[d])).darker(2))
          .style('opacity', 0.75);
        graph.append('path')
          .attr('d', d => `
          ${/* Make sure we don't move past the bottom of the bar */''}
          M 10 ${d3.min([height - 260, height - 260 - barScale(meta.mean[d]) + barScale(meta.sd[d])])}
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
          .style('opacity', 0.5)
          .style('stroke-width', '2px')
          .style('fill', 'none');
      };
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
