(function() {
  'use strict';

  angular
    .module('sshTts')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
