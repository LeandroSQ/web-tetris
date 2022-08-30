
const getHexChannel = (hex, index) => {
	if (hex.length <= 5) {
		const channel = hex.substr(1 + index, 1);

		return `${channel}${channel}`;
	}

	return hex.substr(1 + index * 2, 2);
};

function hexToRGB(hex) {
	if (typeof hex === "string" && hex.startsWith("rgb")) {
		console.log(`${hex} is rgb`);
		const l = hex.substring(hex.indexOf("(") + 1, hex.length - 1);

		return l.split(",").map((x) => parseFloat(x));
	}

	if (typeof hex === "string" && hex[0] === "#") {
		console.log(`${hex} is hex`);
		return [0, 1, 2].map((i) => parseInt(getHexChannel(hex, i), 16));
	}

	return hex;
}

function channelMixer(channelA, channelB, amount) {
	console.log(arguments)
	const a = channelA * (1 - amount);
	const b = channelB * amount;
	console.log(a, b);

	return parseInt(a + b, 10);
}

function blendColors(colorA, colorB, amount = 0.5) {
	console.log(arguments);
	const rgbA = hexToRGB(colorA);
	const rgbB = hexToRGB(colorB);

	const output = [0, 1, 2].map((i) => channelMixer(rgbA[i], rgbB[i], amount));

	return `rgb(${output[0]},${output[1]},${output[2]})`;
}

const lighten = (color, amount) => blendColors(color, "#fff", amount);
const darken = (color, amount) => blendColors(color, "#000", amount);

/**
 * Color utility class
 *
 * Thanks to this stackoverflow answer
 * @link https://stackoverflow.com/a/37600815
 */
export class ColorUtils {

	static #getHexChannel(hex, index) {
		if (hex.length <= 5) {
			const channel = hex.substr(1 + index, 1);

			return `${channel}${channel}`;
		}

		return hex.substr(1 + index * 2, 2);
	}

	static #parseColorValues(color) {
		if (typeof color === "string" && color.startsWith("rgb"))
			return color.substring(color.indexOf("(") + 1, color.length - 1)
				.split(",")
				.map(parseFloat);

		if (typeof color === "string" && color[0] === "#")
			return [0, 1, 2].map(index => parseInt(this.#getHexChannel(color, index), 16));

		return color;
	}

	static #channelMixer(channelA, channelB, amount) {
		const a = channelA * (1 - amount);
		const b = channelB * amount;

		return parseInt(a + b, 10);
	}

	/**
	 * Blends two colors
	 *
	 * Thanks to PimpTrizkit
	 * @link https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
	 *
	 * @param {number} percentage Blending percentage [0.0 - 1.0]
	 * @param {string} colorA Color 1
	 * @param {string} colorB Color 2
	 * @return {string} The blended color
	 */
	static blend(percentage, colorA, colorB) {
		const rgbA = this.#parseColorValues(colorA);
		const rgbB = this.#parseColorValues(colorB);
		const output = [0, 1, 2].map((i) => this.#channelMixer(rgbA[i], rgbB[i], percentage));

		return `rgb(${output[0]},${output[1]},${output[2]})`;
	}

}


window.ColorUtils = ColorUtils;


window.ColorUtils = ColorUtils;