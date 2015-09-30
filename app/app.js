// Declare app level module which depends on views, and components
//angular.module('myApp', ['ngRoute', 'myApp.version'])
//    .config(['$routeProvider', function($routeProvider) {
//      $routeProvider.otherwise({redirectTo: '/view1'});
//}]);

//angular.module('myApp.services', [])

//
//    });
angular.module('sewing-manager',
    ['ngRoute', 'frapontillo.bootstrap-switch',
        'seed',,'datatype','division'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            //.when('/', {
            //  controller:'EntryController',
            //  templateUrl:'../sewing-web/app/point/entry.html'
            //})
            //.when('/search', {
            //  controller:'SearchController',
            //  templateUrl:'search/search.html'
            //})
            //.when('/point/:pointId', {
            //  controller:'NetworkController',
            //  templateUrl:'network/network.html'
            //})
            //.when('/relation/:keyword', {
            //  controller:"PointController",
            //  templateUrl: "point/relation.html"
            //})
            //.when('/data/:portId', {
            //  controller:'DataController',
            //  templateUrl:'src/network/data.html'
            //})
            //.when('/wmouth', {
            //  controller:'WmouthController',
            //  templateUrl:'src/network/wmouth.html'
            //})
            .when("/seed", {
              controller: 'SeedController',
              templateUrl: 'seed/seed.html'
            })
            .when("/rcseed", {
                controller: 'RCSeedController',
                templateUrl: 'rcseed/rcseed.html'
            })
            //.when("/entity/:id", {
            //    controller: 'EntityController',
            //    templateUrl: 'src/ontology/entity.html'
            //})
            .when("/datatype", {
                controller: 'DataTypeController',
                templateUrl: 'datatype/datatype.html'
            })
            .when("/division", {
                controller: 'DivisionController',
                templateUrl: 'division/division.html'
            })
            .otherwise({
              redirectTo:'/'
            });
    }])






    //.directive('modal', function () {
    //    return {
    //        template: '<div class="modal fade">' +
    //                      '<div class="modal-dialog">' +
    //                      '<div class="modal-content">' +
    //                      '<div class="modal-header">' +
    //                      '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
    //                      '<h4 class="modal-title">{{ title }}</h4>' +
    //                      '</div>' +
    //                      '<div class="modal-body" ng-transclude></div>' +
    //                      '</div>' +
    //                      '</div>' +
    //                      '</div>',
    //        restrict: 'E',
    //        transclude: true,
    //        replace:true,
    //        scope:true,
    //        link: function(scope, element, attrs) {
    //            scope.title = attrs.title;
    //
    //            scope.$watch(attrs.visible, function(value){
    //                if(value == true)
    //                    $(element).modal('show');
    //                else
    //                    $(element).modal('hide');
    //            });
    //
    //            $(element).on('shown.bs.modal', function(){
    //                scope.$apply(function(){
    //                    scope.$parent[attrs.visible] = true;
    //                });
    //            });
    //
    //            $(element).on('hidden.bs.modal', function(){
    //                scope.$apply(function(){
    //                    scope.$parent[attrs.visible] = false;
    //                });
    //            });
    //        }
    //    };
    //})














