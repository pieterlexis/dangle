/* 
 * Copyright (c) 2012 FullScale Labs, LLC
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

angular.module('dangle')
    .directive('fsScatter', [function() {
        'use strict';

        return {
            restrict: 'E',

            // set up the isolate scope so that we don't clobber parent scope
            scope: {
                onClick:  '=',
                width:    '=',
                height:   '=',
                bind:     '=',
                xmin:     '=',
                ymin:     '=',
                xmax:     '=',
                ymax:     '=',
    		xint:     '=',
                yint:     '=',
                duration: '@'
            },
			link: function(scope, element, attrs) {

                var margin = {
                    top: 10, 
                    right: 10, 
                    bottom: 10, 
                    left: 10
                };

                var width = scope.width || 1200;
                var height = scope.height || 1200;
                
                // add margin
                width = width - margin.left - margin.right;
                height = height - margin.top - margin.bottom;

		var fields = attrs.fields.split(',');

                var klass = attrs.class || '';
                var align = attrs.align || 'left';

		var xmin = scope.xmin || 0
		var ymin = scope.ymin || 0
		var xmax = scope.xmax
		var ymax = scope.ymax

 		var viewAlign = align === 'right' ? 'xMaxYMin' : 'xMinYMin';
		var xScale = d3.scale.linear()
			.domain([xmin,xmax])
			.range([0, width]);
		var yScale = d3.scale.linear()
			.domain([ymin,ymax])
			.range([height, 0]); // Reversed

                var svg = d3.select(element[0])
                    .append('svg')
                        .attr('preserveAspectRatio', viewAlign + ' meet')
                        .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom))
//                        .attr('width', width)
//                        .attr('height', height)
                        .append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



                scope.$watch('bind', function(data) {

                    // pull info from scope
                    var duration = scope.duration || 0;

                    if (data) {
                        var circles = svg.selectAll('circle')
                            .data(data);

                        // d3 enter fn binds each new value to a circle
                        circles.enter()
                            .append('circle')
//                                .attr('class', 'circle rect ' + klass)
//                                .attr('cursor', 'pointer')
                                .attr('cx', function(d) { return xScale(d['fields'][fields[0]]); })
                                .attr('cy', function(d) { return yScale(d['fields'][fields[1]]); }) // added
                                .attr('r', 2);


                        // d3 exit/remove flushes old values (removes old rects)
                        circles.exit().remove();
                    }
                })
            }
        };
    }]);
