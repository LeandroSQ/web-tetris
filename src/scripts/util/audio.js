import { SoundEffect } from "../enum/sound-effect";

export class AudioUtils {

	static #cache = {};

	/**
	 * Resolves and expands an sound effect to absolute path
	 *
	 * @param {SoundEffect} soundFX
	 * @return {string} The resolved path of the audio file
	 */
	static #resolveAudioPath(soundFX) {
		const locationRoot = window.location.href.indexOf("http://localhost:") ? window.location.href : window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/"));
		const relativePath = "/assets/audio/";

		return locationRoot + relativePath + soundFX;
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

	/**
	 * Loads an audio file from the given path
	 * The audio is cached for future use
	 *
	 * The {@link path} should be resolved and expanded by {@link #resolveAudioPath}
	 *
	 * @param {string} path The resolved path of the audio file to be loaded
	 * @param {boolean} cache Whether the audio should be cached for future use
	 * @return {Promise<ArrayBuffer>} The audio data
	 */
	static async #loadAudio(path, cache=true) {
		// Fetch the audio data from cache
		// if (this.#cache.hasOwnProperty(path)) return this.#cache[path].slice(0);

		// Request the audio file
		const response = await fetch(path);
		const data = await response.arrayBuffer();

		// Cache it
		// if (data && cache) this.#cache[path] = data;

		// Return it
		return data;
	}

	/**
	 * Plays a given sound effect
	 *
	 * @param {Object} obj Rest parameter object
	 * @param {SoundEffect} obj.audio - The audio to play
	 * @param {Number} obj.pitch - The amount of pitch shifting to be applied, ranging from 0.0 to 1.0
	 * @param {Number} obj.volume - The amount of gain to play the audio, ranging from 0.0 to 1.0
	 * @param {Boolean} obj.loop - Determines if the audio will be played in a loop
	 * @param {Boolean} obj.cache - Determines if the audio data should be cached, useful for constantly used sound fx
	 * @param {Function} obj.onStart - Callback, called when start playing
	 * @param {Function} obj.onEnd - Callback, called when end playing
	 */
	static async play({ audio, pitch=1, volume=1, loop=false, cache=true, onStart=null, onEnd=null }) {
		// Create audio context, source and node gain
		const context = this.#createAudioContext();
		const source = context.createBufferSource();
		const gain = this.#createGainNode(context);
		gain.connect(context.destination);

		// Fetch the audio data
		const path = this.#resolveAudioPath(audio);
		const audioData = await this.#loadAudio(path, cache);

		// Decode the audio
		source.buffer = await context.decodeAudioData(audioData);

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

		// Attach callbacks
		if (onStart) setTimeout(onStart, 0);
		if (onEnd) source.addEventListener("ended", onEnd.bind(this));
	}

}