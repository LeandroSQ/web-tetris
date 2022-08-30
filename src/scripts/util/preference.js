import { Setting } from "./../enum/setting";

export class PreferenceUtils {

	/**
	 * Retrieves the value from the stored settings
	 *
	 * @param {Setting} setting
	 * @return {boolean} True when enabled
	 */
	static getSetting(setting) {
		const obj = this.get(setting, true, true);

		return obj === true;
	}

	/**
	 * Stores the value on the settings
	 *
	 * @param {Setting} setting
	 * @param {boolean} enabled Wether the given setting should be enabled
	 */
	static setSetting(setting, enabled) {
		const obj = enabled;
		this.set(setting, obj);
	}

	static get(key, defaultValue = null, parse = true) {
		let raw = localStorage.getItem(key);
		if (!raw) raw = defaultValue;
		if (parse) raw = JSON.parse(raw);

		return raw;
	}

	static set(key, value, stringify = true) {
		let raw = value;
		if (stringify) raw = JSON.stringify(raw);

		return localStorage.setItem(key, raw);
	}

}
