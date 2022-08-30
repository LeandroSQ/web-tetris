import { CELL_RADIUS, GRID_COLS, GRID_ROWS } from "../constants";
import { Cell } from "./cell";
import { DensityCanvas } from "../widget/density-canvas";
import { Piece } from "./piece";

export class Board {

	constructor() {
		// Define the grid size
		this.rows = GRID_ROWS;
		this.columns = GRID_COLS;
		this.grid = [];

		// Fill the grid with empty cells
		this.fill(Cell.empty);

		// Define the cell sizing
		this.width = 0;
		this.height = 0;
		this.cellSize = 0;

		// Define the render buffer
		this.isBufferDirty = true;
		this.buffer = new DensityCanvas();
	}

	fill(value) {
		this.grid = [];

		for (let row = 0; row < this.rows; row++) {
			const rowBuffer = [];

			for (let col = 0; col < this.columns; col++) {
				rowBuffer.push(value);
			}

			this.grid.push(rowBuffer);
		}
	}

	setSize({ width, height }) {
		// Calculate the cell size
		this.cellSize = Math.floor(Math.min(width / this.columns, height / this.rows));
		window.fontScale = this.cellSize / 41;

		// Calculate the board size based on the cell size
		this.width = this.cellSize * this.columns;
		this.height = this.cellSize * this.rows;

		// Set the buffer size
		this.buffer.setSize({
			width: this.width,
			height: this.height,
		});
	}

	render(ctx) {
		// Generate the canvas buffer
		if (this.isBufferDirty) this.#renderGrid();

		// Draws the buffer to the main canvas
		this.buffer.drawBufferTo(0, 0, ctx);
	}

	#renderGrid() {
		// Clear the buffer canvas
		this.buffer.clear();

		this.buffer.context.fillStyle = "rgba(0, 0, 0, 0.35)";
		this.buffer.context.fillRoundRect(0, 0, this.width, this.height, [CELL_RADIUS]);

		// Draws every cell in the grid to the buffer canvas
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				const cell = this.grid[row][col];
				Cell.render(this.buffer.context, cell, col, row, this.cellSize);
			}
		}
	}

	invalidate() {
		this.isBufferDirty = true;
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
				if (piece.shape[row][column] === Piece.empty) continue;

				const x = column + piece.x;
				const y = row + piece.y;

				// Place the new cell into the grid
				this.grid[y][x] = new Cell(piece.color);
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
	checkShapeCollision(piece, rowOffset = 0, columnOffset = 0) {
		for (let row = 0; row < piece.height; row++) {
			for (let column = 0; column < piece.width; column++) {
				// Skip the empty cells of the piece
				if (piece.shape[row][column] === Piece.empty) continue;

				// Calculate the position below the piece's cell
				const x = column + piece.x + columnOffset;
				const y = row + piece.y + rowOffset;

				// Skip the overflown and empty cells
				if (y < 0 || x < 0 || x >= this.columns || y >= this.rows || this.isCellEmpty(y, x))
					continue;

				return true;
			}
		}

		return false;
	}

	/**
	 * Checks whether the given cell is empty
	 *
	 * @param {number} row
	 * @param {number} column
	 *
	 * @return {boolean} True when the cell is empty, False when the cell is not empty
	 */
	isCellEmpty(row, column) {
		// if (row < 0 || row >= this.grid.length || column < 0 || column >= this.grid[0].length) return true;

		return this.grid[row][column] === Cell.empty;
	}

	/**
	 * Removes all the rows that are completely filled from the board
	 *
	 * @return {number} The amount of removed filled rows
	 */
	removeFilledRows() {
		let rowsRemovedCount = 0;

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
				rowsRemovedCount++;

				// Create an empty row
				const emptyRow = [];
				for (let i = 0; i < this.columns; i++)
					emptyRow.push(Cell.empty);

				this.grid.splice(row, 1);

				// Push the empty row at index 0, shifting all rows down
				this.grid.unshift(emptyRow);
			}
		}

		return rowsRemovedCount;
	}

	setColorForAllCells(background, border) {
		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Detect non-empty cells
				if (!this.isCellEmpty(row, column)) {
					// Increment the row counter and exit the column for
					const cell = this.grid[row][column];
					cell.setColor(background, border);
				}
			}
		}
	}

	get rowsWithAtLeastOneCell() {
		let count = 0;

		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				// Detect non-empty cells
				if (!this.isCellEmpty(row, column)) {
					// Increment the row counter and exit the column for
					count++;
					break;
				}
			}
		}

		return count;
	}

}