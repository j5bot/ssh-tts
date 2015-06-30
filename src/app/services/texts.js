(function (undefined) {

	'use strict';
	'be excellent to each other';

	var root = this;

	angular.module('sshTts')
	.factory('SshTts.Texts.Service', [

		'$q',
		'$interval',
		'$cacheFactory',
		'SshTts.Voices.Service',

		function (

			$q,
			$interval,
			$cacheFactory,
			VoicesService

		) {

			var caches = {
					text: $cacheFactory.get('ssh-tts.text') || $cacheFactory('ssh-tts.text')
				},
				lineSegmentRE = /^([A-Za-z\ ]+)\:(|[0-9\.]+(?:\:))(|[0-9\.]+(?:\:))(|[0-9\.]+(?:\:))(.*)$/mig,

				voices = VoicesService.voices();

			return {

				voice: undefined,

				cast: function castVoices (text) {
					var cast = text.split('\n').map(this.castVoice);
				},

				castVoice: function castVoice (line) {
					var segments = line.split(':');

					if ( segments.length < 4 ) {
						return;
					}

					var name = segments.shift(),
						voice = voices.map[segments.shift()],
						rate = segments.shift(),
						pitch = segments.shift();

					voices.map[name] = VoicesService.voice({ voice: voice, rate: rate, pitch: pitch, lang: voice.lang });
				},

				parse: function parseText (text) {
					this.lines = text.split('\n');
					console.log(this.lines);
					this.speak();
				},

				speak: function speakText () {
					var line = this.line.bind(this),
						lines = this.lines;
					$interval(function () {
						line(lines.shift());
					}, 1000);
				},

				line: function parseLine (line) {
					debugger;
					var matches = line ? line.split(':') : null, // lineSegmentRE.exec(line),
						// fullMatch = matches ? matches.shift() : null,
						voice = this.voice,
						rate = 1,
						pitch = 1,
						lang = 'en-US';

					if ( ! matches ) {
						return;
					}

					if (matches.length < 2) {
						if (voice) {
							voice.utter(line);
						}
						return;
					}

					voice = voices.map[matches.shift()];
					line = matches.pop();

					switch (matches.length) {
						case 3:
						case 2:
							pitch = parseFloat(matches.pop());
						case 1:
							rate = parseFloat(matches.pop());
						break;
					}
					voice = this.voice = VoicesService.voice({ voice: voice, rate: rate, pitch: pitch, lang: voice.lang });
					voice.utter(line);
				}

			};

		}

	]);


}).call(this);