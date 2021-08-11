export class Cell {

	/**
	 * @param {string} color HEX format color
	 */
	constructor(color) {
		this.color = color;
	}

	static get empty() {
		return null;
	}

}