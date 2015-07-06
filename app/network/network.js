angular.module('network', [])

.constant('COMMON', {
    export_type: ["网页","文件目录"],
    export_context: ["公告", "通知", "行政处罚"]
})

.constant('ONTOLOGY',{
    test: {
        desc: "测试对象",
        members: [
            {label:"字符串",  type:"string"},
            {label:"民族",  type:"nation"},
            {label:"货币",  type:"currency"},
            {label:"日期",  type:"date"},
            {label:"有效期",  type:"timelimit"},
            {label:"驾照类型",  type:"driving"},
            {label:"银行",  type:"bank"},
            {label:"性别",  type:"sex"},
            {label:"国籍",  type:"country"},
            {label:"公司",  type:"company"},
            {label:"文本块", type: "text"}
        ]
    }
})



.controller('DataController', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {

    var url_api = "http://localhost:7495";

    $scope.portId = $routeParams.portId;

    $scope.items = [
        {date: "2015-01-22",
            title: "关于XXX任免决定",
            entity: "people.ssn",
            error: 1,
            warn: 0},
        {date: "2015-02-02",
            title: "关于XXX项目中标公告",
            entity: "people.zhongbiao",
            error: 0,
            warn: 2}
    ];

    $scope.getDataList = function(pageId) {
        $.ajax({
            async: false,
            type: "GET",
            url: url_api + "/data",
            data: {port: $scope.portId, page:pageId},
            dataType: "jsonp",
            success: function (json) {
                if (json.retcode == 0) {
                    $scope.items = json.result;
                    $scope.$apply();
                }
            },
            error: function () {
                alert("request fail.");
            }
        });
    };
}])

.controller("NetworkController", ['$scope', '$location', '$routeParams', 'ONTOLOGY', function($scope, $location, $routeParams, ontologies) {

    var url_api = "http://localhost:7495";

    //所有的本体
    $scope.ontolist = ontologies;

    $scope.pointid = $routeParams.pointId;

    $scope.data = {nodes:[], edges:[]};

    $scope.options = {
        stabilize: false
    };

    $scope.title = "";

    $scope.enableAdd = false;

    $scope.events = {
        //select: function(properties) {
        //if (properties.nodes.length == 1) {
        //    var id = properties.nodes[0];
        //    $.each($scope.data.nodes, function(i, v) {
        //        if (v.id == id) {
        //          //detail(id);
        //          //scope.drawOntology(v.ontology);
        //          $scope.drawOntology(v.id);
        //          return;
        //        }
        //    });
        //}
        //alert("ok");
        //},
        //click: function(properties) {
        //  alert('click');
        //},
        doubleClick: function(properties) {
            if (properties.nodes.length == 1) {
                var id = properties.nodes[0];
                $scope.showPointDialog(id);
            }
        }
    };

    //function detail(id) {
    //    $("#detail").empty();
    //    $.each(data.edges,function(i,v){
    //        if (v.from == id) {
    //            $.each(data.nodes, function(i, v) {
    //                if (v.id == id) {
    //                    $("<a href='#' class='list-group-item'>" + v.label + "</a>")
    //                        .appendTo($('#detail'))
    //                        .click(function() {detail(v.id);})
    //                }
    //            });
    //        }
    //    });
    //}

    $scope.drawOntology = function(pointId) {

        $.each($scope.data.nodes, function(i, point) {

            if(point.id == pointId) {

                if (point.ontology == "list") {
                    $scope.enableAdd = true;
                }

                $scope.title = point.label;

                $("#detail").empty();
                for(i=0; i<$scope.ontolist.length; i++) {
                    var ontology = $scope.ontolist[i];
                    if (ontology.name == point.ontology) {
                        $.each(ontology.members, function(i, v) {
                            var tag = v.tag;
                            if (tag == "list") {
                                //$('#detail').html(
                                //    $compile("<a href='#' class='list-group-item'>" + v.label+
                                //    "<button class='btn btn-success btn-add' ng-click='addPoint()'>增加</button>" +
                                //    "<span class='badge'>" + 0 + "</span>" +
                                //    "</a>")(scope)
                                //);
                                $("<a ng-click='drawOntology(" + v.label + "," + v.ontology + ")' class='list-group-item'>" + v.label+
                                "<span class='badge'>" + 0 + "</span>" +
                                "</a>").appendTo($('#detail'));
                                //.click(function(){draw_ontology(name, true);})
                            } else {
                                $("<a ng-click='addPoint(4)' class='list-group-item'>" + v.label+
                                "</a>").appendTo($('#detail'));
                                //.click(function() {draw_ontology(tag,false);})
                            }

                        });
                        $compile($('#detail'))($scope);
                        break;
                    }
                }

                $scope.$apply();
                return;
            }
        });


    };

    //绘制节点拓扑图
    $scope.draw = function () {

        //data = (function() {
        //  var json = null;
        //  $.ajax({
        //    'async': false,
        //    'global': false,
        //    'url': "./data.json",
        //    'datatype': "json",
        //    'success': function (data) {
        //      json = data;
        //    }
        //  });
        //  return json;
        //})();


        //var container = document.getElementById('mynetwork');
        //network = new vis.Network(container, data, options);
        //network.on('select', function(properties) {
        //    if (properties.nodes.length == 1) {
        //        var id = properties.nodes[0];
        //        $.each(data.nodes, function(i, v) {
        //            if (v.id == id) {
        //              //detail(id);
        //              drawOntology(v.ontology);
        //              return;
        //            }
        //        });
        //    }
        //});

        //$scope.getRelation();
        //$scope.getPoint($scope.pointid, 4);
    };

    $scope.point2node = function(point) {
        var node = {};
        node.id = point.id;
        var ontology = $scope.ontolist[point.ontology];
        node.label = ontology.desc;
        node.shape = ontology.shape;
        node.point = point;
        return node;
    }

    $scope.link2edge = function(link) {
        var edge = {};
        edge.from = link.from;
        edge.to = link.to;
        edge.style = "arrow-center";
        return edge;
    }

    $scope.getRelation = function() {
        var params = {id: $scope.pointid, degree: 1};
        $.ajax({
            async: false,
            type: "GET",
            url: url_api + "/relation",
            data: params,
            dataType: "jsonp",
            success: function(json) {
                if (json.retcode == 0) {
                    for(i=0; i<json.result.points.length; i++) {
                        var point = json.result.points[i];
                        var node = $scope.point2node(point);
                        $scope.data.nodes.push(node);
                    }

                    for (i=0; i<json.result.links.length; i++) {
                        var link = json.result.links[i];
                        var edge = $scope.link2edge(link);
                        $scope.data.edges.push(edge);
                    }

                    $scope.$apply();
                }
            },
            error: function() {
                alert("request fail");
            }

        });
    };

    $scope.showPointDialog = function(pointId) {
        //var params = {id:pointId};
        //$.ajax({
        //    async: false,
        //    type: "GET",
        //    url: url_api + "/point",
        //    data: params,
        //    dataType: "jsonp",
        //    success: function(json) {
        //        if (json.retcode == 0) {
        //            $scope.point = json.result;
        //            $scope.$apply();
        //            $('#dlgPoint').modal();
        //        }
        //    },
        //    error: function() {
        //        alert("request fail");
        //    }
        //})
        for(var i=0; i<$scope.data.nodes.length; i++) {
            var node = $scope.data.nodes[i];
            if (node.id == pointId) {
                $scope.point = node.point;
                $scope.$apply();
                $('#dlgPoint').modal();
            }
        }

    }



    //获取节点
    //$scope.getPoint = function(pointId, degrees) {
    //    var params = {id:pointId, degree: degrees};
    //    $.ajax({
    //        async: false,
    //        type: "GET",
    //        url: url_api + "/point",
    //        data: params,
    //        dataType: "jsonp",
    //        success: function (json) {
    //            if (json.retcode == 0) {
    //
    //                for (var i=0; i<json.result.nodes.length; i++) {
    //                  $scope.data.nodes.push(json.result.nodes[i]);
    //                }
    //                for (var i=0; i<json.result.edges.length; i++) {
    //                  $scope.data.nodes.push(json.result.edges[i]);
    //                }
    //                $scope.$apply();
    //            }
    //        },
    //        error: function () {
    //          alert("request fail");
    //        }
    //    });
    //};

}])

.controller("WmouthController", ['$scope', '$location', '$routeParams', 'DATA_TYPE', 'ONTOLOGY',
        function($scope, $location, $routeParams, dataType, ontologies){

    var url_api = "http://localhost:7495";

    //数据类型
    $scope.datatype = dataType;

    //所有的本体
    $scope.ontolist = ontologies;

    //当前选择的本体
    $scope.current_ontology = null;

    //当前所选本体对应的数据节点列表
    $scope.pointlist = [];

    //新创建的节点
    $scope.current_point = null;

    $scope.showModal = false;

    //获取本体数量
    $scope.getOntologyCount = function() {

        $.ajax({
            async: false,
            type: "GET",
            url: url_api + "/ontology",
            data: {},
            dataType: "jsonp",
            success: function (json) {
                if (json.retcode == 0) {
                    for(i=0; i<json.result.length; i++) {
                        var item = json.result[i];
                        var ontology = $scope.ontolist[item.ontology];
                        if (ontology != null) {
                            ontology.count = item.count;
                        }
                    }
                    $scope.$apply();
                }

            },
            error: function () {
                alert("request fail");
            }
        });
    };

    //选择本体
    $scope.selectOntology = function(ontoname) {

        $scope.pointlist={};
        $scope.current_ontology = ontoname;

        var params = {name:ontoname};
        $.ajax({
            async: false,
            type: "GET",
            url: url_api + "/points",
            data: params,
            dataType: "jsonp",
            success: function(json) {
                if (json.retcode == 0) {
                    for(i=0; i<json.result.length; i++) {
                        var id = json.result[i].id;
                        $scope.pointlist[id] = json.result[i];
                    }
                    $scope.$apply();
                }
            },
            error: function() {
                alert("request fail");
            }
        });
    };

    $scope.upgradePoint = function(point) {
        var ontoname = point.ontology;
        var ontology = $scope.ontolist[ontoname];
        $.each(ontology.members, function(i, member) {
            var found = false;
            for(i=0; i<point.data.length; i++){
                var item = point.data[i];
                if (member.label == item.label) {
                    found = true;
                    if (member.type != item.type) {
                        item.type = member.type;
                    }
                    break;
                }
            }
            if (found == false) {
                var item = {};
                item.label  = member.label;
                item.type = member.type;
                item.value = "";
                point.data.push(item);
            }
        });
    }

    $scope.showPointDialog = function(pointid) {
        if (pointid == null) {
            //创建节点
            $scope.current_point = {};
            $scope.current_point.data = [];
            $scope.current_point.ontology = $scope.current_ontology;
            for(i=0; i<$scope.ontolist[$scope.current_ontology].members.length; i++) {
                var field = {};
                field.label = $scope.ontolist[$scope.current_ontology].members[i].label;
                field.type = $scope.ontolist[$scope.current_ontology].members[i].type;
                field.value = "";
                $scope.current_point.data.push(field);
            }
        } else {
            //修改节点
            var point = $.extend(true, {}, $scope.pointlist[pointid]);
            $scope.upgradePoint(point);
            $scope.current_point = point;
        }
        $('#dlgPoint').modal();
    }

    $scope.savePoint = function(pointid) {
        if (pointid == null) {
            //添加节点
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/createpoint",
                data: {point: encodeURI(angular.toJson($scope.current_point), "utf-8")},
                dataType: "jsonp",
                success: function (json) {
                    if (json.retcode == 0) {
                        var id = json.result;
                        $scope.current_point.id = id;
                        $scope.pointlist[id] = $scope.current_point;
                        $scope.current_point = {};
                        $scope.ontolist[$scope.current_ontology].count += 1;

                        $scope.$apply();
                    }

                },
                error: function () {
                    alert("request fail");
                }
            });
        } else {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/updatepoint",
                data: {point:encodeURI(angular.toJson($scope.current_point), "utf-8")},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.pointlist[pointid] = $scope.current_point;
                        $scope.current_point = {};
                    }
                },
                error: function() {
                    alert("request fail");
                }
            });
        }
    };

    $scope.deletePoint = function(pointid) {
        var params = {id:pointid,ontology:$scope.current_ontology};
        $.ajax({
            async: false,
            type: "GET",
            url: url_api + "/deletepoint",
            data: params,
            dataType: "jsonp",
            success: function(json) {
                if (json.retcode == 0) {

                    delete $scope.pointlist[pointid];
                    //
                    //for(i=0; i<$scope.pointlist.length;i++) {
                    //    if ($scope.pointlist[i].id == pointid) {
                    //      $scope.pointlist.splice(i, 1);
                    //      break;
                    //    }
                    //}

                    $scope.current_point = {};

                    //更新计数器
                    $scope.ontolist[$scope.current_ontology].count -= 1;

                    $scope.$apply();
                }
            },
            error: function() {
                alert("request fail");
            }
        });

    };

    $scope.showRelation = function(pointid) {
        $location.path("/point/"+pointid);
    }



}])
