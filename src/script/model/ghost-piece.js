import { BasePiece } from "./base-piece.js";

export class GhostPiece extends BasePiece {

	constructor(piece) {
		super();

		this.owner = piece;
		this.game = piece.game;
		this.lastShapeLength = piece.shape.length;

		this.drawPosition = {
			x: 0,
			y: piece.y
		};

		this.color = {
			background: `${piece.color.background}34`,
			border: `${piece.color.border}34`
		};
	}

	loop() {
		let needToRecalculateCollisions = false;
		if (this.x !== this.owner.x || this.lastShapeLength != this.owner.shape.length) needToRecalculateCollisions = true;
		this.lastShapeLength = this.owner.shape.length;

		this.drawPosition.x = Math.floor(this.owner.position.x);

		// If the owner piece moved, check the ground collisions
		if (needToRecalculateCollisions) {
			this.drawPosition.y = this.owner.drawPosition.y;

			// Increment the Y until the ghost piece reaches a non-empty cell or the grid bottom
			while (this.y + this.height < this.game.grid.rows && !this.game.grid.checkShapeCollision(this, 1, 0)) {
				this.drawPosition.y = Math.ceil(this.drawPosition.y + 1);
			}
		}
	}

	get x() {
		return Math.floor(this.drawPosition.x);
	}

	get y() {
		return Math.ceil(this.drawPosition.y);
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