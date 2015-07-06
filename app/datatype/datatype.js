angular.module('datatype', [])
.controller("DataTypeController", ['$scope', '$location',

    function($scope, $location) {

        var url_api = "http://localhost:4151";

        $scope.datatypes = {};

        $scope.selected = {};

        $scope.test_result = [];

        $scope.types = {
            none: "任意",
            dict: "字典",
            regex: "正则表达式",
            nlp_name: "姓名识别",
            nlp_organization: "机构名称识别"
        };

        $scope.getDataTypeList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/list",
                data: {},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $.each(json.result, function(i, dt) {
                            $scope.datatypes[dt.id] = dt;
                        });

                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.selectDataType = function(id) {
            $scope.selected = $.extend(true, {}, $scope.datatypes[id]);
        }

        $scope.createDataType = function() {
            $scope.selected = {};
            $scope.selected.name = "未命名";
            $scope.selected.type = "none";
            $scope.selected.unique = false;
            $scope.selected.rule = "";
            $scope.selected.sample = "";

            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/create",
                data: {id:$scope.selected.id,
                    name: encodeURI($scope.selected.name, "utf-8"),
                    type: $scope.selected.type,
                    unique:$scope.selected.unique,
                    rule: encodeURIComponent($scope.selected.rule, "utf-8"),
                    sample:encodeURIComponent($scope.selected.sample, "utf-8")
                },
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.selected.id = json.result;
                        $scope.datatypes[json.result] = $scope.selected;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })

        }

        $scope.saveDataType = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/update",
                data: {id:$scope.selected.id,
                        name: encodeURI($scope.selected.name, "utf-8"),
                        type: $scope.selected.type,
                        unique:$scope.selected.unique,
                        rule: encodeURIComponent($scope.selected.rule, "utf-8"),
                        sample:encodeURIComponent($scope.selected.sample, "utf-8")
                },
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.datatypes[$scope.selected.id] = $scope.selected;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.testDataType = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/test",
                data: {id:$scope.selected.id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.test_result = json.result;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.deleteDataType = function(id) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/ontology/datatype/delete",
                data: {id:id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        delete $scope.datatypes[id];
                        $scope.selected = {};
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }
    }
]);
