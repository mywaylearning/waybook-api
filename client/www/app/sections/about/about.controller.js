'use strict';

function PlaylistsController($scope) {
  $scope.playlists = [
    { title: 'WayReggae', id: 1 },
    { title: 'WayChill', id: 2 }
  ];
}

PlaylistsController.$inject = ['$scope'];

module.exports = PlaylistsController;
