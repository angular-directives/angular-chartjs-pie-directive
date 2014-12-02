/*!
 * AngularJS Chart.js Pie Directive
 *
 * Copyright 2013 Stephane Begaudeau
 * Released under the MIT license
 */
angular.module('angular.directives-chartjs-pie', []).directive('angChartjsPie', [function () {
  var getOptionsFromScope = function (scope) {
    var options = {};

    var potentialOptions = [
      {key:'chartjsSegmentShowStroke', value:'segmentShowStroke', isBoolean: true},
      {key:'chartjsSegmentStrokeColor', value:'segmentStrokeColor'},
      {key:'chartjsSegmentStrokeWidth', value:'segmentStrokeWidth', isNumber: true},
      {key:'chartjsAnimation', value:'animation', isBoolean: true},
      {key:'chartjsAnimationSteps', value:'animationSteps', isNumber: true},
      {key:'chartjsAnimationEasing', value:'animationEasing'},
      {key:'chartjAnimationRotate', value:'animationRotate', isBoolean: true},
      {key:'chartjsAnimationScale', value:'animationScale', isBoolean: true}
    ];

    for (var i = 0; i < potentialOptions.length; i++) {
      if (scope.hasOwnProperty(potentialOptions[i].key) && scope[potentialOptions[i].key] !== undefined) {
        options[potentialOptions[i].value] = scope[potentialOptions[i].key];
      }
    }

    return options;
  };

  var chartjsPie = {
    restrict: 'E',
    //compile: compilationFunction,
    template: '<canvas class="ang-chartjs-pie"></canvas>',
    scope: {
      chartjsModel: '=',
      chartjsWidth: '=',
      chartjsHeight: '=',
      chartjsSegmentShowStroke: '=',
      chartjsSegmentStrokeColor: '=',
      chartjsSegmentStrokeWidth: '=',
      chartjsAnimation: '=',
      chartjsAnimationSteps: '=',
      chartjsAnimationEasing: '=',
      chartjAnimationRotate: '=',
      chartjsAnimationScale: '='
    },
    link: function (scope, elements, attributes) {
      scope.$watch('chartjsModel', function (newValue) {
        if (newValue !== undefined) {
          var options = getOptionsFromScope(scope);

          if (scope.chart !== undefined) {
            scope.chart.Pie(newValue, options);
          } else {
            var width = scope.chartjsWidth || '400';
            var height = scope.chartjsHeight || '400';

            var canvas = elements[0].children[0];
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);

            var chart = new Chart(canvas.getContext('2d'));
            chart.Pie(newValue, options);
            scope.chart = chart;
          }
        }
      }, true);
    }
  };
  return chartjsPie;


















  var compilationFunction = function (templateElement, templateAttributes, transclude) {
    if (templateElement.length === 1) {
      var node = templateElement[0];

      var width = node.getAttribute('data-chartjs-width') || '400';
      var height = node.getAttribute('data-chartjs-height') || '400';

      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      canvas.setAttribute('data-chartjs-model', node.getAttribute('data-chartjs-model'));

      var options = {};

      var potentialOptions = [

      ];

      for (var i = 0; i < potentialOptions.length; i++) {
        var aKey = node.getAttribute(potentialOptions[i].key);
        if (aKey && potentialOptions[i].isBoolean) {
          if ('true' === aKey) {
            options[potentialOptions[i].value] = true;
          } else if ('false' === aKey) {
            options[potentialOptions[i].value] = false;
          }
        } else if (aKey && potentialOptions[i].isNumber) {
          options[potentialOptions[i].value] = parseInt(aKey);
        }else if (aKey) {
          options[potentialOptions[i].value] = aKey;
        }
      }

      var chart = new Chart(canvas.getContext('2d'));
      node.parentNode.replaceChild(canvas, node);

      return {
        pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
          var expression = canvas.getAttribute('data-chartjs-model');
          scope.$watch(expression, function (newValue, oldValue) {
            var callback = scope[node.getAttribute('data-chartjs-on-animation-complete')];
            if (callback !== undefined) {
              options.onAnimationComplete = callback;
            }

            chart.Pie(newValue, options);
          }, true);
        },
        post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
      };
    }
  };

  var chartjsBar = {
    compile: compilationFunction,
    replace: true
  };
  return chartjsBar;
}]);
