import { BasePiece } from "./base-piece.js";
import { Cell } from "./cell.js";

export class Grid {

	constructor({ rows, columns }) {
		this.cells = [];
		this.rows = rows;
		this.columns = columns;

		this.#setupCells();
	}

	#setupCells() {
		for (let y = 0; y < this.rows; y++) {
			const buffer = [];

			for (let x = 0; x < this.columns; x++) {
				buffer.push(Cell.empty);
			}

			this.cells.push(buffer);
		}
	}

	render(ctx, cellSize) {
		this.#renderLines(ctx, cellSize);
		this.#renderCells(ctx, cellSize);
	}

	/**
	 * Places a given piece into the grid
	 * Transforming it's shape into grid cells
	 *
	 * @param {Piece} piece The piece to be placed on to the grid
	 */
	place(piece) {
		for (let row = 0; row < piece.height; row++) {
			for (let column = 0; column < piece.width; column++) {
				// Ignore empty cells
				if (piece.shape[row][column] === BasePiece.empty) continue;

				const x = column + piece.x;
				const y = row + piece.y;

				// Place the new cell into the grid
				this.cells[y][x] = new Cell(piece.color);
			}
		}
	}

	/**
	 * Detects whether there is a cell bellow the provided piece
	 *
	 * @param {BasePiece} piece
	 *
	 * @return {Boolean} False when no cell bellow the piece, True when there is at least one cell bellow the piece
	 */
	isAnyCellBellowShape(piece) {
		return this.checkShapeCollision(piece, 1, 0);
	}

	/**
	 * Detects whether there is a cell colliding with the provided piece
	 *
	 * @param {BasePiece} piece
	 * @param {Number} rowOffset The Y offset
	 * @param {Number} columnOffset The X offset
	 *
	 * @return {Boolean} False when no cell is colliding the piece, True when there is one
	 */
	checkShapeCollision(piece, rowOffset=0, columnOffset=0) {
		for (let row = 0; row < piece.height; row++) {
			for (let column = 0; column < piece.width; column++) {
				// Skip the empty cells of the piece
				if (piece.shape[row][column] === BasePiece.empty) continue;

				// Calculate the position below the piece's cell
				const x = column + piece.x + columnOffset;
				const y = row + piece.y + rowOffset;

				// Skip the overflown and empty cells
				if (y < 0 || x < 0 || x >= this.columns || y >= this.rows || this.isCellEmpty(y, x)) continue;

				return true;
			}
		}

		return false;
	}

	removeFilledRows() {
		let count = 0;

		for (let row = 0; row < this.rows; row++) {
			let filled = true;

			for (let column = 0; column < this.columns; column++) {
				// Ignore empty cells
				if (this.isCellEmpty(row, column)) {
					// Notify that the row wasn't all filled
					filled = false;
					break;
				}
			}

			// If the row was totally filled
			if (filled) {
				// Increment the filled row counter
				count++;

				// Create an empty row
				const emptyRow = [];
				for (let i = 0; i < this.columns; i++) emptyRow.push(Cell.empty);

				this.cells.splice(row, 1);

				// Push the empty row at index 0, shifting all rows down
				this.cells.unshift(emptyRow);
			}
		}

		return count;
	}

	isCellEmpty(row, column) {
		return this.cells[row][column] === Cell.empty;
	}

	countRowsWithAtLeastOneCell() {
		let count = 0;

		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Detect non-empty cells
				if (!this.isCellEmpty(row, column)) {
					// Increment the row counter and exit the column for
					count ++;
					break;
				}
			}
		}

		return count;
	}

	#renderCells(ctx, cellSize) {
		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Ignore empty cells
				if (this.isCellEmpty(row, column)) continue;

				// Fetch the cell
				const cell = this.cells[row][column];

				// Set the cell color
				ctx.fillStyle = cell.color.background;
				ctx.strokeStyle = cell.color.border;

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
	}

	#renderLines(ctx, cellSize) {
		// Define the color of the lines
		ctx.strokeStyle = "#ecf0f1";
		ctx.lineWidth = 0.5;

		// Draw the horizontal lines
		for (let row = 0; row <= this.rows; row++) {
			ctx.beginPath();
			ctx.moveTo(0, cellSize * row);
			ctx.lineTo(cellSize * this.rows, cellSize * row);
			ctx.stroke();
		}

		// Draw the vertical lines
		for (let column = 0; column <= this.columns; column++) {
			ctx.beginPath();
			ctx.moveTo(cellSize * column, 0);
			ctx.lineTo(cellSize * column, cellSize * this.rows);
			ctx.stroke();
		}
	}

	setColorForAllCells(background, border) {
		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Detect non-empty cells
				if (!this.isCellEmpty(row, column)) {
					// Increment the row counter and exit the column for
					const cell = this.cells[row][column];
					cell.color = { background, border };
				}
			}
		}
	}

}