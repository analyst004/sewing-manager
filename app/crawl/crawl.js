angular.module('crawl', [])
.controller('CrawlController', ['$scope', '$location',  '$routeParams',
    function($scope, $location,  $routeParams) {

        var url_api = "http://localhost:8080/wmouth";

        $scope.crawlId = $routeParams.id;

        $scope.status = null;

        $scope.page = {};

        $scope.datatypes = {};

        $scope.selected = null;

        $scope.getDataTypeList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/list",
                data: {},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $.each(json.result, function(i, datatype) {
                            $scope.datatypes[datatype.id] = datatype;
                        });

                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.getCrawlStatus = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/crawl/status",
                data: {id:$scope.crawlId},
                dataType: "jsonp",
                success: function (json) {
                    if (json.retcode == 0) {
                        $scope.status = json.result;
                        $scope.$apply();
                    }
                },
                error: function () {
                    alert("request fail.");
                }
            });
        };



        $scope.getItemList = function(pageId) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/crawl/item/list",
                data: {id:$scope.crawlId, pageNo: pageId, pageSize:50},
                dataType: "jsonp",
                success: function (json) {
                    if (json.retcode == 0) {
                        $scope.page = json.result;
                        $scope.$apply();
                    }
                },
                error: function () {
                    alert("request fail.");
                }
            });
        };

        $scope.analysis = function(itemId) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/crawl/item/analysis",
                data: {seedId:$scope.crawlId, itemId: itemId},
                dataType: "jsonp",
                success: function (json) {
                    if (json.retcode == 0) {
                        $.each($scope.page.items, function(i, item){
                            if (item.id == itemId) {
                                $scope.page.items[i] = json.result;
                            }
                        });
                        $scope.$apply();
                    }
                },
                error: function () {
                    alert("request fail.");
                }
            });
        };

        $scope.showOriginDialog = function(itemId) {
            $.each($scope.page.items, function(i, item){
                if (item.id == itemId) {
                    $scope.selected = $.extend(true, {}, item);
                    $('#dlgOrigin').modal();
                }
            })
        };

        $scope.showLogDialog = function(itemId) {
            $.each($scope.page.items, function(i, item){
                if (item.id == itemId) {
                    $scope.selected = $.extend(true, {}, item);
                    $('#dlgLog').modal();
                }
            })
        }

        $scope.showContentDialog = function(itemId) {
            $.each($scope.page.items, function(i, item) {
                if (item.id == itemId) {
                    $scope.selected = $.extend(true, {}, item);
                    $("#dlgContent").modal();
                }
            });
        }

        $scope.showOntologyDialog = function(itemId) {
            $.each($scope.page.items, function(i, item) {
               if (item.id == itemId) {
                   $scope.selected = $.extend(true, {}, item);
                   $scope.selected.ontology = JSON.parse($scope.selected.ontology);
                   $('#dlgOntology').modal();
               }
            });
        }
    }
]);

