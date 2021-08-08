import { Piece } from "./piece.js";

export class GhostPiece {

	constructor(piece) {
		this.owner = piece;

		this.x = piece.x;
		this.y = piece.y;
		this.color = `${piece.color}80`;
	}

	loop(grid) {
		this.x = this.owner.x;
		this.y = this.owner.y;

		// Increment the Y until the ghost piece reaches a non-empty cell or the grid bottom
		while (this.y + this.height < grid.rows && !grid.checkShapeCollision(this, 1, 0)) {
			this.y++;
		}
	}

	render(ctx, cellSize) {
		// Set the piece color
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#ecf0f1";
		ctx.lineWidth = 1.5;

		// Draws the piece at it's position
		ctx.translate(this.x * cellSize, this.y * cellSize);

		for (let row = 0; row < this.shape.length; row++) {
			for (let column = 0; column < this.shape[row].length; column++) {
				// Ignore empty spaces
				if (this.shape[row][column] === Piece.empty) continue;

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

	get shape() {
		return this.owner.shape;
	}

	get width() {
		return this.owner.width;
	}

	get height() {
		return this.owner.height;
	}

}