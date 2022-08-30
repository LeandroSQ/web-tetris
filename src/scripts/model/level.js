export class Level {
	static list = [];

	/**
	 * @param {object} obj
	 * @param {number} obj.speed The level speed multiplier
	 * @param {object} obj.page The level page color definition
	 * @param {string} obj.page.background
	 * @param {string} obj.page.foreground
	 * @param {object} obj.pieces The level pieces color definition
	 * @param {string} obj.shape Specify which shape to draw in the board cells
	 * @param {SVGAnimatedBoolean} obj.fillShape Specify whether to fill or stroke the shape
	 * @param {Array<string>} obj.pieces.background
	 * @param {Array<string>} obj.pieces.border
	 */
	constructor({ speed, pieces, page, shape, fillShape }) {
		this.speed = speed;
		this.page = page;
		this.pieces = pieces;
		this.shape = shape;
		this.fillShape = fillShape;
	}

	applyPageColors() {
		const root = document.documentElement;

		root.style.setProperty("--background", this.page.background);
		root.style.setProperty("--foreground", this.page.foreground);

		window.fillShape = this.fillShape;
		window.drawShape = this.shape;
	}

	/**
	 * @param {number} index
	 *
	 * @return {{ background: string, border: string }} The size of the grid
	 */
	getColorForPiece(index) {
		return {
			background:
				this.pieces.background[index % this.pieces.background.length],
			border: this.pieces.border[index % this.pieces.border.length],
		};
	}
}