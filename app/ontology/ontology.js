angular.module('ontology', [])
.controller("OntologyController", ['$scope', '$location',

    function($scope, $location) {

        var url_api = "http://localhost:8080";

        $scope.category_list = [];

        $scope.select_category = null;

        $scope.ontology_list = [];

        $scope.select_ontology = null;

        //获取实体类别列表
        $scope.getCategoryList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/category/query",
                data: {},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.category_list = json.result;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }

            });
        };

        //显示实体类别编辑对话框
        $scope.showCategoryDialog = function(id) {
            if (id == null) {
                //create
                $scope.select_category = {};
                $scope.select_category.name = "";
            } else {
                //update
                $.each($scope.category_list, function(i, category) {
                    if (category.id == id) {
                        $scope.select_category = $.extend(true, {}, category);
                    }
                })
            }
            $scope.$apply();
            $('#dlgCategory').modal();
        };

        //创建新的实体类别
        $scope.createCategory = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/category/create",
                data: {name: encodeURI($scope.select_category.name, "utf-8")},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.select_category.id = json.result;
                        $scope.category_list.push($scope.select_category);
                        $scope.$digest();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        //更新实体类别名称
        $scope.updateCategoryName = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/category/update_name",
                data: {id: $scope.select_category.id,
                    name: encodeURI($scope.select_category.name, "utf-8")},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $.each($scope.category_list, function(i, category){
                            if (category.id == $scope.select_category.id) {
                                category.name = $scope.select_category.name;
                            }
                        });
                        $scope.select_category = {};
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        //删除实体类别
        $scope.deleteCategory = function(id) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/category/delete",
                data: {id: id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        var index = -1;
                        $.each($scope.category_list, function(i, category){
                            if (category.id == id) {
                                index = i;
                            }
                        })
                        if (index != -1 ) {
                            $scope.category_list.splice(index, 1);
                            $scope.select_category = {};
                            $scope.$digest();
                        }
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        //显示实体编辑对话框
        $scope.showOntologyDialog = function(id) {
            if (id == null) {
                //create
                $scope.select_ontology = {};
                $scope.select_ontology.title = "";
                $scope.select_ontology.description = "";
                $scope.select_ontology.category = $scope.select_category.id;
            } else {
                //update
                $scope.select_ontology = $.extend(true, {}, $scope.ontology_list[id]);
            }
            $scope.$apply();
            $('#dlgOntology').modal();
        }

        $scope.getOntologyList = function(id) {

            $.each($scope.category_list, function(i, category){
                if (category.id == id) {
                    $scope.select_category = category;
                }
            })

            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/list",
                data: {id:id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.ontology_list = json.result;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.createOntology = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/create",
                data: {title: encodeURI($scope.select_ontology.title, "utf-8") ,
                    description: encodeURI($scope.select_ontology.description, "utf-8"),
                    category: $scope.select_ontology.category},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.select_ontology.id = json.result;
                        $scope.ontology_list.push($scope.select_ontology);
                        $scope.$digest();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.deleteOntology = function(id) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/delete",
                data: {id: id},
                success: function(json) {
                    if (json.retcode == 0) {
                        delete $scope.ontology_list[id];
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.showOntology = function(id) {

            $location.path("/entity/"+id);
            //var path = "/wface/index.html#/entity/" +id;
            //window.open(path, "_blank");
        }

        $scope.showDataTypeList = function(id) {
            $location.path("/datatype");
            //
            //var path = "/wface/index.html#/datatype";
            //window.open(path, "_blank");
        }
    }
])
.controller("EntityController", ['$scope', '$location',  '$routeParams',

    function($scope, $location, $routeParams){

        var url_api = "http://localhost:8080";

        $scope.id = $routeParams.id;

        $scope.ontology = {};

        $scope.datatypes = {};

        $scope.new_name = null;

        $scope.category_list = [];

        $scope.getOntology = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/query",
                data: {id: $scope.id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.ontology = json.result;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        //获取实体类别列表
        $scope.getCategoryList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/category/query",
                data: {},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.category_list = json.result;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }

            });
        };

        $scope.getDataTypeList = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/datatype/list",
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

        $scope.showMemberDialog = function(id) {
            if (id == null) {
                //create
                $scope.select_member = {};
                $scope.select_member.id = null;
                $scope.select_member.title = "";
                $scope.select_member.type = "";
            } else {
                //update
                $.each($scope.ontology.members, function(i, member) {
                    if (member.id == id) {
                        $scope.select_member = $.extend(true, {}, member);
                    }
                })
            }
            $scope.$apply();
            $('#dlgMember').modal();
        };

        $scope.createMember = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/create_member",
                data: {id: $scope.id,
                    title: encodeURI($scope.select_member.title, "utf-8"),
                    type: $scope.select_member.type},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.select_member.id = json.result;
                        $scope.ontology.members.push($scope.select_member);
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.deleteMember = function(id) {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/delete_member",
                data: {id: $scope.id, memberId: id},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        var index = -1;
                        $.each($scope.ontology.members, function (i, member) {
                            if (member.id == id) {
                                index = i;
                            }
                        });
                        if (index != -1) {
                            $scope.ontology.members.splice(index, 1);
                            $scope.select_member = {};
                            $scope.$apply();
                        }
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.updateMember = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/update_member",
                data: {id: $scope.id,
                    memberId: $scope.select_member.id,
                    title:encodeURI($scope.select_member.title, "utf-8"),
                    type: $scope.select_member.type},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $.each($scope.ontology.members, function(i, member){
                            if (member.id == $scope.select_member.id) {
                                member.title = $scope.select_member.title;
                                member.type = $scope.select_member.type;
                            }
                        });
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.showOntologyTitleDialog = function() {
            $scope.new_title = $scope.ontology.title;
            $scope.$apply();
            $('#dlgOntologyTitle').modal();
        }

        $scope.updateOntologyTitle = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/update_title",
                data: {id:$scope.id,
                    title: encodeURI($scope.new_title, "utf-8")},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.ontology.title = $scope.new_title;
                        $scope.new_title = null;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.showOntologyDescriptionDialog = function() {
            $scope.new_description = $scope.ontology.description;
            $scope.$apply();
            $('#dlgOntologyDescription').modal();
        }

        $scope.updateOntologyDescription = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/update_description",
                data: {id: $scope.id,
                    description: encodeURI($scope.new_description, "utf-8")},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.ontology.description = $scope.new_description;
                        $scope.new_description = null;
                        $scope.$apply();
                    }

                },
                error: function() {
                    alert("request fail.");
                }
            })
        }

        $scope.showOntologyCategoryDialog = function() {
            $scope.new_category = $scope.ontology.category;
            $scope.$apply();
            $("#dlgOntologyCategory").modal();
        }

        $scope.updateOntologyCategory = function() {
            $.ajax({
                async: false,
                type: "GET",
                url: url_api + "/wmouth/ontology/update_category",
                data: {id: $scope.id,
                    category: $scope.new_category},
                dataType: "jsonp",
                success: function(json) {
                    if (json.retcode == 0) {
                        $scope.ontology.category = $scope.new_category;
                        $scope.new_category = null;
                        $scope.$apply();
                    }
                },
                error: function() {
                    alert("request fail.");
                }
            })
        }
    }
])

