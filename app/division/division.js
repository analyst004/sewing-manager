angular.module('division', [])

.controller('DivisionController', ['$scope', '$location',
    function($scope, $location) {
        var url_api = "http://sewing.sidooo.com:4151";

        $scope.title = "行政区域";

        $scope.division_list = [];

        $scope.getDivisionList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/division/CHN",
                data: {},
                dataType: "jsonp",
                success: function (json) {
                    if (json.retcode == 0) {
                        $scope.division_list = json.result;

                        $('#tree').treeview({data: $scope.division_list});
                        //$('#tree').on('nodeSelected', $scope.getSeedList);
                        $scope.$apply();
                    }
                },
                error: function () {
                    alert("request fail");
                }
            });
        };

        $scope.exportJson = function() {

            $scope.json_string = JSON.stringify($scope.division_list);
            $('#dlgExport').modal();
        }
    }
])
