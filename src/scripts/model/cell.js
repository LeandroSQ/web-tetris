import { CELL_PADDING, CELL_RADIUS, EMPTY_CELL_BACKGROUND, EMPTY_CELL_BORDER } from "../constants";

export class Cell {

	/**
	 * @param {Object} color
	 * @param {string} color.background HEX format color
	 * @param {string} color.border HEX format color
	 */
	constructor(color) {
		this.color = color;
	}

	setColor(background, border) {
		this.color.background = background;
		this.color.border = border;
	}

	/**
	 * Draws the cell to the canvas
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Cell} [cell] When null, draws the empty cell
	 * @param {number} column
	 * @param {number} row
	 * @param {number} cellSize
	 */
	// eslint-disable-next-line max-params
	static render(ctx, cell, column, row, cellSize) {
		if (cell) {
			// Filled cell
			ctx.fillStyle = cell.color.background;
			ctx.strokeStyle = cell.color.border;
		} else {
			// Empty cell
			ctx.fillStyle = EMPTY_CELL_BACKGROUND;
			ctx.strokeStyle = EMPTY_CELL_BORDER;
		}

		// Draw cell
		ctx.lineWidth = window.fillShape ? 1 : 2;
		ctx.beginPath();
		ctx.drawShape(
			column * cellSize + CELL_PADDING,
			row * cellSize + CELL_PADDING,
			cellSize - CELL_PADDING * 2,
			cellSize - CELL_PADDING * 2
		);

		if (window.fillShape) ctx.fill();
		ctx.stroke();
		// ctx.closePath();
	}

	static get empty() {
		return null;
	}

}
