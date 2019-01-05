(function() {

  const top25pertop25 = (data, showSubtags) => {
    // Visualization size.
    const width = 800;
    const height = 720;

    // Add SVG element.
    const vis = d3.select('#sofurry__top25pertop25')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Transition used in bar widths/colors
    const t = d3.transition().duration(500);

    // Group for the cotags graph.
    const graph = vis.append('g')
      .classed('graph', true)
      .attr('transform', 'translate(200, 0)');

    // Bound elements for the tags list.
    const tags = vis.append('g')
      .classed('tags', true)
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 32})`);

    // The background rect for the tag item.
    tags.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 30)
      .style('fill', (d, i) => d3.interpolatePurples(1 - (i + 1) / data.length))
      .style('opacity', 0.62);

    // The text for the tag item.
    tags.append('text')
      .text(d => d.tag)
      .attr('x', 100)
      .attr('y', 18)
      .style('text-anchor', 'middle')
      .style('font-size', '12pt');

    // The overlay for the tag item, to which events are attached.
    tags.append('rect')
      .classed('overlay', true)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 30)
      .style('fill', '#000')
      .style('opacity', 0)
      .style('cursor', 'pointer')
      .on('mouseover', function() {
        const el = d3.select(this);
        if (el.classed('selected')) {
          return;
        }
        el.style('opacity', 0.1);
      })
      .on('mouseout', function() {
        const el = d3.select(this);
        if (el.classed('selected')) {
          return;
        }
        el.style('opacity', 0);
      })
      .on('click', function(d) {
        // Deselect previous tag.
        tags.selectAll('.overlay')
          .classed('selected', false)
          .style('opacity', 0);

        // Mark this one as selected.
        const el = d3.select(this);
        el.style('opacity', 0.25);
        el.classed('selected', true);

        // Our cotags.
        update(d.cotags);
      });

      /**
       * Update the graph of cotags
       */
      const update = (cotags) => {
        // Scale for the bars.
        const max = cotags[0].count;
        const min = cotags[cotags.length - 1].count;
        const barScale = d3.scaleLinear()
          .range([400, 1])
          .domain([max, min]);

        // Bind the data.
        const item = graph.selectAll('g')
          .data(cotags)
          .attr('transform', (ct, i) => `translate(0, ${i * 25})`);

        // Remove old tags.
        item.exit()
          .transition(t)
          .style('opacity', 0)
          .remove();

        // Update cotag text.
        item.select('text')
          .text(ct => ct.tag)
          .attr('x', 195)
          .attr('y', 14)
          .style('text-anchor', 'end')
          .style('font-size', '10pt');

        // Update the bar.
        item.select('rect')
          .attr('x', 200)
          .attr('y', 0)
          .attr('height', 24)
          .transition(t)
          .attr('width', ct => barScale(ct.count))
          .style('fill', ct => d3.interpolateBlues(ct.count / max));

        // Append new elements.
        const enter = item.enter()
          .append('g')
          .attr('transform', (ct, i) => `translate(0, ${i * 25})`);
        enter.append('text');
        enter.append('rect');
      };

      // Prep the graph with an example of data.
      // d3 is being weird here and requires a double click if we don't do this,
      // and also won't append additional elements if we call this with an empty
      // array. I suspect it's due to the data being bound to the g and stuff
      // going into the rect and text elements inside the g. However, I don't
      // have time to fix this before FC, so we deal :S
      update(data[0].cotags);
  };

  const top25years = (data) => {
    // Visualization size.
    const width = 800;
    const height = 720;

    // Add SVG element.
    const vis = d3.select('#sofurry__top25years')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Group for the years graph.
    const graph = vis.append('g')
      .classed('graph', true)
      .attr('transform', 'translate(200, 0)');

    const max = d3.max([].concat.apply([], data.map(d => d.values)).map(d => d.count));
    data.forEach(d => d.values.forEach(dd => dd.count = dd.count / max));
    const validYears = [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010,
                        2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018];
    const yearWidth = (width - 200) / (validYears.length - 1);
    const xScale = d3.scaleLinear()
      .domain([1, 0])
      .range([100, 500]);
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => validYears.indexOf(d.year) * yearWidth)
      .y(d => xScale(d.count));

    const years = graph.append('g')
      .selectAll('g.tag')
      .data(data)
      .enter()
      .append('g')
      .classed('tag', true);

    years.append('path')
      .datum(d => d.values)
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke-width', 1)
      .style('stroke', '#666')
      .style('opacity', 0.25);

    const update = d => {
      d.selected = !d.selected;
      years.classed('selected', dd => dd.selected);
      years.select('path')
        .style('stroke-width', function() {
          return this.parentElement.classList.contains('selected') ? 3 : 1;
        })
        .style('opacity', function() {
          return this.parentElement.classList.contains('selected') ? 1 : 0.24;
        });
    }

    // Bound elements for the tags list.
    const tags = vis.append('g')
      .classed('tags', true)
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${i * 32})`);

    // The background rect for the tag item.
    tags.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 30)
      .style('fill', (d, i) => d3.interpolatePurples(1 - (i + 1) / data.length))
      .style('opacity', 0.62);

    // The text for the tag item.
    tags.append('text')
      .text(d => d.tag)
      .attr('x', 100)
      .attr('y', 18)
      .style('text-anchor', 'middle')
      .style('font-size', '12pt');

    // The overlay for the tag item, to which events are attached.
    tags.append('rect')
      .classed('overlay', true)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 200)
      .attr('height', 30)
      .style('fill', '#000')
      .style('opacity', d => d.selected ? 0.25 : 0)
      .style('cursor', 'pointer')
      .on('mouseover', function(d) {
        if (d.selected) {
          return;
        }
        d3.select(this).style('opacity', 0.1);
      })
      .on('mouseout', function(d) {
        if (d.selected) {
          return;
        }
        d3.select(this).style('opacity', 0);
      })
      .on('click', update); // Javascript, you are a hot mess.

  };

  window.presentation = window.presentation || {};
  window.presentation.sofurry = {
    top25pertop25: () => d3.json('vis/sofurry/top25pertop25.json').then(top25pertop25),
    top25years: () => d3.json('vis/sofurry/top25years.json').then(top25years),
    _leave: () => delete(window.presentation.sofurry)
  }
})();
