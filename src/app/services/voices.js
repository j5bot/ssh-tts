(function (undefined) {
	
	'use strict';
	'be excellent to each other';

	var root = this;

	angular.module('sshTts')
	.constant('SshTts.Voices.SpeechSynthesis', window.speechSynthesis)
	.factory('SshTts.Voices.Service', [

		'$q',
		'$resource',
		'$cacheFactory',

		'SshTts.Voices.SpeechSynthesis',

		function SshTtsVoicesService (

			$q,
			$resource,
			$cacheFactory,

			SpeechSynthesis

		) {

			var caches = {
				voiceMap: {},
				// use voice number, rate, pitch
				voice: $cacheFactory.get('ssh-tts.voice') || $cacheFactory('ssh-tts.voice'),
				// browser specified voices
				voiceList: SpeechSynthesis.getVoices().filter(voiceListFilter)
			};

			caches.voiceList.map(voiceListMap);

			function voiceListFilter (voice, index, array) {
				return voice.lang.indexOf('en-') === 0;
			}

			function voiceListMap (voice, index, array) {
				var short = voice.name.split(' ');
				if (short.length > 1) {
					short = short.map(function (v) { return v.charAt(0); }).join('');
					caches.voiceMap[short] = voice;
				}
				return caches.voiceMap[voice.name] = voice;
			}

			function createUtterance () {
				return angular.extend(new SpeechSynthesisUtterance(), Utterance);
			}

			var Utterance =  {

				create: function utteranceCreate (definition) {				
					if ( angular.isString(definition) && caches.voice.get(definition) ) {
						return caches.voice.get(definition);
					}

					var voiceKey = [definition.voice.name,definition.rate,definition.pitch,definition.lang].join('|');

					if ( caches.voice.get(voiceKey) ) {
						return caches.voice.get(voiceKey);
					}

					var utterance = createUtterance();
					utterance.pitch = definition.pitch || 1, utterance.volume = definition.volume || 1, utterance.rate = definition.rate || 1;
					utterance.voice = definition.voice;
					caches.voice.put(voiceKey, utterance);

					return utterance;
				},

				utter: function utteranceUtter (options,text) {
					var utterance = this;

					if ( angular.isObject(options) ) {
						angular.extend(utterance,options);
					}

					if ( angular.isString(options) ) {
						text = options;
					}

					if ( text) {
						utterance.text = text;
					}
					SpeechSynthesis.speak(utterance);

					return utterance;
				}

			};

			return {
				voices: function voices () {

					return {
						list: caches.voiceList,
						map: caches.voiceMap
					};

				},

				// keyOrDefinition is: voice #, pitch, lang
				// options are: volume, rate, text
				voice: function voice (keyOrDefinition, options) {
					var voice = Utterance.create(keyOrDefinition);
					// if ( ! voice.utter ) {
						voice.utter = Utterance.utter.bind(voice, options);
					// }
					return voice;
				},

				speak: function speak (voice, text) {
					voice.utter(text);
				} 

			};

		}

	]);

}).call(this);