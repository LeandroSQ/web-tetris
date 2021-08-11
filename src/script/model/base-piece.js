/**
 * @property {Array<Array<Number>>} shape
 * @property {Number} x
 * @property {Number} y
 */
export class BasePiece {

	constructor() {

	}

	/**
	 * Renders the piece shape
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} cellSize
	 */
	render(ctx, cellSize) {
		// Set the piece color
		ctx.save();
		ctx.fillStyle = this.color.background;
		ctx.strokeStyle = this.color.border;
		ctx.lineWidth = 1.5;

		// Draws the piece at it's position
		ctx.translate(this.drawPosition.x * cellSize, this.drawPosition.y * cellSize);

		for (let row = 0; row < this.shape.length; row++) {
			for (let column = 0; column < this.shape[row].length; column++) {
				// Ignore empty spaces
				if (this.shape[row][column] === BasePiece.empty) continue;

				// Calculate cell position
				const x = column * cellSize;
				const y = row * cellSize;

				// Draws the cell
				ctx.beginPath();
				ctx.rect(x, y, cellSize, cellSize);
				ctx.fill();
				ctx.stroke();
			}
		}

		ctx.restore();
	}

	static get empty() {
		return 0;
	}

	/**
	 * The amount of cells that aren't empty on the shape
	 **/
	get cellCount() {
		let count = 0;

		for (let row = 0; row < this.shape.length; row++) {
			for (let column = 0; column < this.shape[row].length; column++) {
				// Ignore empty spaces
				if (this.shape[row][column] === BasePiece.empty) continue;

				count++;
			}
		}

		return count;
	}

}
