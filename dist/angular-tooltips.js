(function() {
    'use strict';

    var directive = function ($timeout) {
        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, element, attrs) {
                if (attrs.title || attrs.tooltip) {
                    // stop the standard tooltip from being shown
                    $timeout(function () {
                        element.removeAttr('ng-attr-title');
                        element.removeAttr('title');
                    });

                    element.on('mouseover', function (event) {
                        var direction = $scope.getDirection();

                        // create the tooltip
                        var tooltip = angular.element('<div>')
                            .addClass('angular-tooltip angular-tooltip-' + direction)
                            .html(attrs.title || attrs.tooltip);

                        // append to the body
                        angular.element(document).find('body').append(tooltip);

                        // position the tooltip
                        var css = $scope.calculatePosition(tooltip, direction);

                        tooltip.css(css);

                        // fade in
                        tooltip.addClass('angular-tooltip-fade-in');
                    });

                    // removes all tooltips from the document to reduce ghosts
                    $scope.removeTooltip = function () {
                        var tooltip = angular.element(document.querySelectorAll('.angular-tooltip'));
                        tooltip.removeClass('angular-tooltip-fade-in');

                        $timeout(function() {
                            tooltip.remove();
                        }, 300);
                    };

                    // gets the current direction value
                    $scope.getDirection = function() {
                        return element.attr('tooltip-direction') || element.attr('title-direction') || 'top';
                    };

                    $scope.calculatePosition = function(tooltip, direction) {
                        var tooltipBounding = tooltip[0].getBoundingClientRect();
                        var elBounding = element[0].getBoundingClientRect();
                        var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
                        var scrollTop = window.scrollY || document.documentElement.scrollTop;
                        var arrow_padding = 12;

                        switch (direction) {
                            case 'top':
                            case 'top-center':
                            case 'top-middle':
                                return {
                                    left: elBounding.left + (elBounding.width / 2) - (tooltipBounding.width / 2) + scrollLeft + 'px',
                                    top: elBounding.top - tooltipBounding.height - (arrow_padding / 2) + scrollTop + 'px',
                                };
                            case 'top-right':
                                return {
                                    left: elBounding.left + elBounding.width - arrow_padding + scrollLeft + 'px',
                                    top: elBounding.top - tooltipBounding.height - (arrow_padding / 2) + scrollTop + 'px',
                                };
                            case 'right-top':
                                return {
                                    left: elBounding.left + elBounding.width + (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top - tooltipBounding.height + arrow_padding + scrollTop + 'px',
                                };
                            case 'right':
                            case 'right-center':
                            case 'right-middle':
                                return {
                                    left: elBounding.left + elBounding.width + (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top + (elBounding.height / 2) - (tooltipBounding.height / 2) + scrollTop + 'px',
                                };
                            case 'right-bottom':
                                return {
                                    left: elBounding.left + elBounding.width + (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top + elBounding.height - arrow_padding + scrollTop + 'px',
                                };
                            case 'bottom-right':
                                return {
                                    left: elBounding.left + elBounding.width - arrow_padding + scrollLeft + 'px',
                                    top: elBounding.top + elBounding.height + (arrow_padding / 2) + scrollTop + 'px',
                                };
                            case 'bottom':
                            case 'bottom-center':
                            case 'bottom-middle':
                                return {
                                    left: elBounding.left + (elBounding.width / 2) - (tooltipBounding.width / 2) + scrollLeft + 'px',
                                    top: elBounding.top + elBounding.height + (arrow_padding / 2) + scrollTop + 'px',
                                };
                            case 'bottom-left':
                                return {
                                    left: elBounding.left - tooltipBounding.width + arrow_padding + scrollLeft + 'px',
                                    top: elBounding.top + elBounding.height + (arrow_padding / 2) + scrollTop + 'px',
                                };
                            case 'left-bottom':
                                return {
                                    left: elBounding.left - tooltipBounding.width - (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top + elBounding.height - arrow_padding + scrollTop + 'px',
                                };
                            case 'left':
                            case 'left-center':
                            case 'left-middle':
                                return {
                                    left: elBounding.left - tooltipBounding.width - (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top + (elBounding.height / 2) - (tooltipBounding.height / 2) + scrollTop + 'px',
                                };
                            case 'left-top':
                                return {
                                    left: elBounding.left - tooltipBounding.width - (arrow_padding / 2) + scrollLeft + 'px',
                                    top: elBounding.top - tooltipBounding.height + arrow_padding + scrollTop + 'px',
                                };
                            case 'top-left':
                                return {
                                    left: elBounding.left - tooltipBounding.width + arrow_padding + scrollLeft + 'px',
                                    top: elBounding.top - tooltipBounding.height - (arrow_padding / 2) + scrollTop + 'px',
                                };
                        }
                    };

                    element.on('mouseout', $scope.removeTooltip);
                    element.on('destroy', $scope.removeTooltip);
                    $scope.$on('$destroy', $scope.removeTooltip);
                }
            }
        };
    };

    directive.$inject = ['$timeout'];

    angular
        .module('tooltips', [])
        .directive('title', directive)
        .directive('tooltip', directive);
})();
