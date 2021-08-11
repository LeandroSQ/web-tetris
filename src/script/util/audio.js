export class AudioUtils {

	static #cache = {};

	static #decodeAudioData(audioContext, audioData) {
		return new Promise((resolve, reject) => {
			audioContext.decodeAudioData(audioData.slice(0),
				(buffer) => {
					resolve(buffer);
				},
				(error) => {
					reject(error);
				}
			);
		});
	}

	/** @return {AudioContext} */
	static #createAudioContext() {
		if (window.AudioContext) return new window.AudioContext();
		else return new window.webkitAudioContext();// eslint-disable-line new-cap
	}

	/**
	 * @param {AudioContext} context
	 *
	 * @return {GainNode}
	 **/
	static #createGainNode(context) {
		if ("createGain" in context) return context.createGain();
		else return context.createGainNode();
	}

	static async #loadAudio(path) {
		const response = await fetch(path);

		return await response.arrayBuffer();
	}

	/**
	 * Plays a given sound effect
	 *
	 * @param {Object} obj Rest parameter object
	 * @param {SoundFX} obj.audio - The audio to play
	 * @param {Number} obj.pitch - The amount of pitch shifting to be applied, ranging from 0.0 to 1.0
	 * @param {Number} obj.volume - The amount of gain to play the audio, ranging from 0.0 to 1.0
	 * @param {Boolean} obj.loop - Determines if the audio will be played in a loop
	 * @param {Boolean} obj.cache - Determines if the audio data should be cached, useful for constantly used sound fx
	 */
	static async play({ audio, pitch=1, volume=1, loop=false, cache=true }) {
		// Create audio context, source and node gain
		const context = this.#createAudioContext();
		const source = context.createBufferSource();
		const gain = this.#createGainNode(context);
		gain.connect(context.destination);

		// Fetch the audio data
		let audioData = null;
		if (this.#cache.hasOwnProperty(audio)) {
			// If the given audio was already cached, load from the cache
			audioData = this.#cache[audio];
		} else {
			// If the given audio wasn't cached before, load it
			audioData = await this.#loadAudio(audio);

			// Caches the loaded audio, if requested
			if (cache) this.#cache[audio] = audioData;
		}

		// Decode the audio
		source.buffer = await this.#decodeAudioData(context, audioData);

		// Set the pitch
		source.playbackRate.value = pitch;

		// Set the volume
		source.connect(gain);
		gain.gain.value = volume;

		// Set the loop
		source.loop = loop;

		// Play the audio
		source.play = source.start;
		source.play();
	}

}