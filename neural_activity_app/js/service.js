// var ContextServices = angular.module('ContextServices', ['ngResource', 'btorfs.multiselect', 'ApiCommunicationServices', ]);

// ContextServices.service('Context', ['$rootScope', '$location', 'AppIDRest', 'CollabIDRest', 'collabAppID',
//     function($rootScope, $location, AppIDRest, CollabIDRest, collabAppID) {
//         var ctx;
//         var state_type = undefined;
//         var state = undefined;
//         var external = undefined;
//         var collabID = undefined;
//         var appID = undefined;
//         var serviceSet = false;


//         var getCurrentLocationSearch = function() {
//             return window.location.search;
//         }
//         var setService = function() {
//             return new Promise(function(resolve, reject) {

//                 if (serviceSet == false) {
//                     // _getState();
//                     var location = getCurrentLocationSearch();
//                     temp_state = location.split("&")[1];


//                     if (temp_state != undefined && temp_state != "ctxstate=") {
//                         temp_state2 = temp_state.split("%2C")[0];
//                         temp_state2 = temp_state2.substring(9);
//                         state_type = temp_state2.split(".")[0]
//                         state = temp_state2.split(".")[1]

//                         if (temp_state.split("%2C")[1] != undefined) {
//                             external = temp_state.split("%2C")[1];
//                         }
//                     }

//                     // _getCtx();
//                     if (ctx == undefined) {
//                         ctx = window.location.search.split("&")[0].substring(5);
//                     }

//                     // getCollabID();
//                     if (collabID == undefined || collabID == "") {
//                         var collab_request = CollabIDRest.get({ ctx: ctx }); //.collab_id;
//                         collab_request.$promise.then(function() {
//                             collabID = collab_request.collab_id
//                         });
//                     }

//                     // getAppID();
//                     if (appID == undefined || appID == "") {
//                         var app_request = AppIDRest.get({ ctx: ctx }); //.collab_id;
//                         app_request.$promise.then(function() {
//                             appID = app_request.app_id
//                         });
//                     }

//                     if (app_request == undefined) {
//                         if (collab_request == undefined) {
//                             serviceSet = true;
//                             resolve();
//                         } else {
//                             collab_request.$promise.then(function() {
//                                 serviceSet = true;
//                                 resolve();
//                             });
//                         }
//                     } else {
//                         app_request.$promise.then(function() {

//                             if (collab_request == undefined) {
//                                 serviceSet = true;
//                                 resolve();

//                             } else {
//                                 collab_request.$promise.then(function() {
//                                     serviceSet = true;
//                                     resolve();
//                                 });
//                             }
//                         });
//                     }

//                 } else {
//                     resolve();
//                 }

//             });
//         };

//         var setState = function(id) {
//             state = id;
//         };


//         var getExternal = function() {
//             return external;
//         }

//         var getState = function() {
//             return state;
//         };

//         var getStateType = function() {
//             return state_type;
//         }

//         var getCtx = function() {
//             return ctx;
//         };

//         var setCtx = function(context) {
//             ctx = context;
//         }

//         var getCollabID = function() {
//             return collabID;
//         };

//         var getAppID = function() {
//             return appID;
//         };

//         var getServiceSet = function() {
//             return serviceSet;
//         }

//         var sendState = function(type, id) {
//             state_type = type;
//             window.parent.postMessage({
//                 eventName: 'workspace.context',

//                 data: {
//                     state: type + '.' + id
//                 }
//             }, 'https://collab.humanbrainproject.eu/');
//         };


//         var clearState = function() {

//             window.parent.postMessage({
//                 eventName: 'workspace.context',

//                 data: {
//                     state: ''
//                 }
//             }, 'https://collab.humanbrainproject.eu/');

//             state = "";
//             state_type = undefined;


//             setTimeout(function() {
//                 // window.location.href = "ctx=" + getCtx() + "&ctxstate=";
//                 window.location.hash = "ctx=" + getCtx() + "&ctxstate=";
//                 // console.log(window.location.hash);

//                 // window.location.search = "ctx=" + getCtx() + "&ctxstate=";


//             }, 300);

//         };

//         var clearExternal = function() {
//             sendState(state_type, state);
//             // window.location.search = "ctx=" + getCtx() + "&ctxstate="+state_type+"."+state;
//             window.location.search = "ctx=" + getCtx() + "&ctxstate=";
//         };

//         return {
//             setService: setService,
//             setCtx: setCtx,
//             getCtx: getCtx,
//             getCollabID: getCollabID,
//             getAppID: getAppID,
//             getState: getState,
//             getServiceSet: getServiceSet,
//             sendState: sendState,
//             clearState: clearState,
//             clearExternal: clearExternal,
//             setState: setState,
//             getExternal: getExternal,
//             getStateType: getStateType,
//             getCurrentLocationSearch: getCurrentLocationSearch,
//         }
//     }
// ]);



