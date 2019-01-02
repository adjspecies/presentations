(function() {
  const chartSexImportance = (_data => {
    const utils = {
      objectToArray: (obj) => {
        return obj instanceof Array ?
          obj :
          Object.keys(obj).map(k => {
            return {key: k, values: obj[k]};
          });
      },
      objectToChartData: function (n, obj) {
        return obj.map(item => {
          item.values = utils.objectToArray(item.values)
            .map(yearItem => {
                return {
                  key: yearItem.key,
                  values: yearItem.values / n[item.key] * 100
                };
              });
          return item;
        });
      },
      mean: (n, obj) => {
        obj.forEach(year => year.values = utils.objectToArray(year.values));
        return {
          n: Object.values(n).reduce((m, n) => m + (isNaN(parseInt(n)) ? 0 : n)) / 60,
          values: obj[0].values.map((item, index) => {
            return obj.reduce((m, year) => {
              m.values += year.values[index].values;
              return m;
            }, {key: item.key, values: 0});
          })
        };
      }
    };

    return (n, _chartData, id) => {
      const width = 800;
      const height = 720;
      const container = d3.select('#seximportance__' + id);
      if (!container) {
        return;
      }
      const el = container.append('svg')
        .attr('width', width)
        .attr('height', height);
      const means = utils.mean(n, utils.objectToChartData(n, utils.objectToArray(_chartData)));
      n.mean = means.n;
      _chartData.mean = means.values;
      const chartData = utils.objectToChartData(n, utils.objectToArray(_chartData));


      const xScale = d3.scaleLinear()
        .domain([1, 10])
        .range([50, width - 10]);
      const yScale = d3.scaleLinear()
        .domain([
          0,
          d3.max(means.values.map(d => d.values)) / means.n
        ])
        .range([height - 50, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format('.0%'));
      el.append('g')
        .classed('axis', true)
        .attr('transform', `translate(0, ${height - 50})`)
        .call(xAxis);
      el.append('g')
        .classed('axis', true)
        .attr('transform', 'translate(50, 0)')
        .call(yAxis);

      el.append('text')
        .attr('x', 50)
        .attr('y', height - 15)
        .style('font-size', '10pt')
        .text('Not very important');
      el.append('text')
        .attr('x', width - 5)
        .attr('y', height - 15)
        .attr('text-anchor', 'end')
        .style('font-size', '10pt')
        .text('Very important');
      el.append('text')
        .attr('transform', `rotate(-90) translate(-${height / 2 - 25}, 15)`)
        .attr('text-anchor', 'middle')
        .style('font-size', '10pt')
        .text('percentage of respondents');

      const line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(parseInt(d.key)))
        .y(d => yScale(d.values / means.n));
      el.append('path')
        .datum(means.values)
        .attr('fill', 'none')
        .attr('stroke', '#756bb1')
        .attr('stroke-width', 3)
        .attr('d', line);
    }
  })();

  window.presentation = window.presentation || {};
  window.presentation.seximportance = {
    self: () => {
      d3.json('vis/furrysurvey/seximportance/overview.json').then(data => {
        console.log('presentation.seximportance.self loaded data');
        chartSexImportance(
          data.n,
          data.perception_of_fandom.importance_of_sex.self,
          'self');
      });
    },
    others: () => {
      d3.json('vis/furrysurvey/seximportance/overview.json').then(data => {
        console.log('presentation.seximportance.others loaded data');
        chartSexImportance(
          data.n,
          data.perception_of_fandom.importance_of_sex.others,
          'others');
      });
    },
    public: () => {
      d3.json('vis/furrysurvey/seximportance/overview.json').then(data => {
        console.log('presentation.seximportance.public loaded data');
        chartSexImportance(
          data.n,
          data.perception_of_fandom.importance_of_sex.public,
          'public');
      });
    },
    _leave: () => delete(window.presentation.seximportance)
  };

  console.log('loaded presentation.seximportance');
})();
