(function() {
  'use strict';

  angular
    .module('sshTts')
    .controller('MainController', [ 'SshTts.Voices.Service', 'SshTts.Texts.Service', MainController ]);

  function MainController( VoicesService, TextsService ) {
    var vm = this;

    vm.creationDate = 1435541487122;

    vm.voices = VoicesService.voices();
    console.log(vm.voices);

    vm.speak = SpeakMessage.bind(VoicesService);
    vm.parse = function (id) {
      TextsService.parse($('#' + id).val());
    };
    vm.cast = function (id) {
      TextsService.cast($('#' + id).val());
    };

  }

  function SpeakMessage (speaker) {
    var VoicesService = this;

    var voice = VoicesService.voice({
      voice: speaker,
      volume: 1,
      rate: 1,
      pitch: 1,
      lang: speaker.lang
    });

    VoicesService.speak(voice, 'hello world');
  }

})();
