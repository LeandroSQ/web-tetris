import { CELL_PADDING, CELL_RADIUS } from "../constants";

/**
 * @property {Array<Array<Number>>} shape
 * @property {Number} x
 * @property {Number} y
 */
export class Piece {

	/**
	 * Renders the piece shape
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} cellSize
	 */
	render(ctx, cellSize) {
		// Set the piece color
		ctx.fillStyle = this.color.background;
		ctx.strokeStyle = this.color.border;
		ctx.lineWidth = 1.5;

		for (let row = 0; row < this.shape.length; row++) {
			for (let column = 0; column < this.shape[row].length; column++) {
				// Ignore empty spaces
				if (this.shape[row][column] === Piece.empty) continue;

				// Calculate cell position
				const x = column * cellSize;
				const y = row * cellSize;

				// Draws the cell
				ctx.beginPath();
				ctx.drawShape(
					this.drawPosition.x * cellSize + x + CELL_PADDING,
					this.drawPosition.y * cellSize + y + CELL_PADDING,
					cellSize - CELL_PADDING * 2,
					cellSize - CELL_PADDING * 2
				);
				ctx.closePath();
				if (window.fillShape) ctx.fill();
				ctx.stroke();
			}
		}

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
				if (this.shape[row][column] === Piece.empty) continue;

				count++;
			}
		}

		return count;
	}

}
