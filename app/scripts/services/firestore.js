'use strict';

/**
 * @ngdoc service
 * @name clientApp.firestore
 * @description
 * # firestore
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('FirestoreService', function ($firebaseStorage, $log) {

    var dataUrltoBlob = function(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].split(':')[1].split(';')[0],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    };

    var uploadImg = function (url, callback) {

      var storageRef = firebase.storage().ref("restaurant_images/" + guid());
      var storage = $firebaseStorage(storageRef);

      var uploadProfileTask = storage.$put(dataUrltoBlob(url));
      uploadProfileTask.$complete(function(snapshot) {
        snapshot.ref.getDownloadURL()
          .then(function(downUrl){
          callback(downUrl);
        })  ;
      });
    };

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    return {
      uploadImage : uploadImg
    };
  });
