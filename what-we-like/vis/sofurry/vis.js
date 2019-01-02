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

  window.presentation = window.presentation || {};
  window.presentation.sofurry = {
    vis: () => d3.json('vis/sofurry/top25pertop25.json').then(top25pertop25),
    _leave: () => delete(window.presentation.sofurry)
  }
})();
