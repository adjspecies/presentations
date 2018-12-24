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
      const container = d3.select('#seximportance__' + id);
      if (!container) {
        return;
      }
      const el = container.append('svg');
      const means = utils.mean(n, utils.objectToChartData(n, utils.objectToArray(_chartData)));
      n.mean = means.n;
      _chartData.mean = means.values;
      const chartData = utils.objectToChartData(n, utils.objectToArray(_chartData));
      // TODO....
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
