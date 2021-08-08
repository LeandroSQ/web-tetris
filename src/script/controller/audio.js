export class AudioController {

	constructor() {
		this.audioCache = { };
	}

	#decodeAudioData(audioContext, audioData) {
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
	#createAudioContext() {
		if (window.AudioContext) return new window.AudioContext();
		else return new window.webkitAudioContext();// eslint-disable-line new-cap
	}

	async #loadAudio(path) {
		const response = await fetch(path);

		return await response.arrayBuffer();
	}

	/**
	 * Plays a given sound fx
	 *
	 * @param {Object} obj Rest parameter object
	 * @param {SoundFX} obj.audio - The audio to play
	 * @param {Number} obj.pitch - The amount of pitch shifting to be applied, ranging from 0.0 to 1.0
	 * @param {Number} obj.volume - The amount of gain to play the audio, ranging from 0.0 to 1.0
	 * @param {Boolean} obj.loop - Determines if the audio will be played in a loop
	 * @param {Boolean} obj.cache - Determines if the audio data should be cached, useful for constantly used sound fx
	 */
	async play({ audio, pitch=1, volume=1, loop=false, cache=true }) {
		// Create audio context, source and node gain
		const context = this.#createAudioContext();
		const source = context.createBufferSource();
		const gain = context.createGain();
		gain.connect(context.destination);

		// Fetches de audio data
		let audioData = null;
		if (this.audioCache.hasOwnProperty(audio)) {
			// If the given audio was already cached, load from the cache
			audioData = this.audioCache[audio];
		} else {
			// If the given audio wasn't cached before, load it
			audioData = await this.#loadAudio(audio);

			// Caches the loaded audio, if requested
			if (cache) this.audioCache[audio] = audioData;
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

	/**
	 * Retrieves an existing singleton instance of the InputController
	 * Or creates a new one
	 *
	 * @return {AudioController} The singleton instance of the InputController
	 */
	static get instance() {
		if (!window.audioControllerInstance) window.audioControllerInstance = new AudioController();

		return window.audioControllerInstance;
	}
}

// TODO: Fix this, it's only a temporary solution for github pages
const audioSourcePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));

export const SoundFX = {
	"PLACE_BLOCK": `${audioSourcePath}/audio/place.mp3`,
	"GAME_OVER": `${audioSourcePath}/audio/gameover.wav`,
	"THEME": `${audioSourcePath}/audio/music.mp3`,
	"SCORE": `${audioSourcePath}/audio/score.wav`,
};