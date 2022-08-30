import { Piece } from "./piece";
import { FallingPiece } from "./falling-piece";
import { PIECE_MOVING_SPEED } from "../constants";
import { ColorUtils } from "../util/color";

export class GhostPiece extends Piece {

	/**
	 * @param {FallingPiece} piece
	 */
	constructor(piece) {
		super();

		this.owner = piece;
		this.game = piece.game;
		this.lastShapeLength = this.#getOwnerShapeDimensions();

		this.drawPosition = {
			x: 0,
			y: piece.y,
		};

		this.calculateColor();
	}

	calculateColor() {
		// In order to not utilize the alpha blending (Issues with ctx.path)
		// Simulate the alpha blending with the current page background
		// on the board background -> rgba(0,0,0,0.35)
		// on the cell background -> rgba(0,0,0,0.15)
		// And finally apply 34% of this to the owner piece color
		let blend = ColorUtils.blend(0.35, this.game.currentLevel.page.background, "#000");/* Board */
		blend = ColorUtils.blend(0.15, blend, "#000");/* Cell */
		this.color = {/* Owner */
			background: ColorUtils.blend(1 - 0.34, this.owner.color.background, blend),
			border: ColorUtils.blend(1 - 0.34, this.owner.color.border, blend)
		};
	}

	update(deltaTime) {
		// If the owner piece moved or rotated, check the ground collisions
		let needToRecalculateCollisions = false;
		if (this.x !== this.owner.x || this.lastShapeLength != this.#getOwnerShapeDimensions()) {
			needToRecalculateCollisions = true;
			this.lastShapeLength = this.#getOwnerShapeDimensions();
		}

		this.drawPosition.x = this.owner.x;

		// If the owner piece moved, check the ground collisions
		if (needToRecalculateCollisions) {
			this.drawPosition.y = this.owner.y;

			// Increment the Y until the ghost piece reaches a non-empty cell or the grid bottom
			while (this.y + this.height < this.game.board.rows && !this.game.board.checkShapeCollision(this, 1, 0)) {
				this.drawPosition.y = Math.ceil(this.drawPosition.y + 1);
			}
		}
	}

	#getOwnerShapeDimensions() {
		return `${this.owner.shape.length}x${this.owner.shape[0].length}`;
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
