export class LocaleUtils {

	static #locale = "en";

	static #localeData = null;

	static async #fetchLocale() {
		// Define the supported languages
		const supportedLanguages = ["en", "pt"];
		// Fetch the browser's known languages
		const userKnownLanguages = navigator.languages.map(x =>
			// Split the - country code, getting only the language
			x.split("-")
			 .find(x => x)
		);

		// Get a common ground, the first language that is both supported and the browser knows
		const commonGround = userKnownLanguages.find(x => supportedLanguages.includes(x));

		// Either  common ground or the first supported language
		this.#locale = commonGround || supportedLanguages.find(x => x);
	}

	static async #loadLocaleData() {
		// Request the .json file
		const request = await fetch(`assets/locale/${this.#locale}.json`);
		// Parse it
		const response = await request.json();
		// Store it
		this.#localeData = response;
	}

	static async initialize() {
		await this.#fetchLocale();
		await this.#loadLocaleData();
	}

	/**
	 * Given a key, returns a localized string
	 *
	 * @param {string} key The entry on the .json files to fetch
	 * @return {string} The localized entry
	 */
	static get(key) {
		if (!this.#localeData.hasOwnProperty(key)) {
			console.error(`Could not load entry ${key} at ${this.#locale}.json!`);

			return "";
		}

		return this.#localeData[key];
	}

}
