import { Piece } from "./piece";
import { Tetromino } from "./tetromino";
import { Main } from "../main";
import { InputUtils } from "../util/input";
import { Key } from "../enum/key";
import { PIECE_FALLING_SPEED, PIECE_MOVING_SPEED } from "../constants";

export class FallingPiece extends Piece {

	/**
	 * @param {Main} game
	 * @param {Tetromino} tetromino
	 */
	constructor(game, tetromino) {
		super();

		this.game = game;

		// Store the tetromino type and shape
		this.type = tetromino.type;
		this.shape = tetromino.shape;

		// Starts the piece at the top-center of the board
		this.position = {
			x: game.board.columns / 2 - this.width / 2,
			y: -1,
		};
		this.drawPosition = { x: this.position.x, y: this.position.y };
	}

	update(deltaTime) {
		const speed = PIECE_MOVING_SPEED * deltaTime;
		this.drawPosition.x = Math.lerp(this.drawPosition.x, Math.floor(this.position.x), speed);
		this.drawPosition.y = Math.lerp(this.drawPosition.y, Math.ceil(this.position.y), speed * 2);

		// Handles the user input
		this.#handleInput(deltaTime);

		// Apply the falling speed to the piece
		this.move({
			x: 0,
			y: PIECE_FALLING_SPEED * deltaTime * this.game.currentLevel.speed,
		});
	}

	/**
	 * Moves the piece based on user input
	 *
	 * @param {number} deltaTime
	 */
	// eslint-disable-next-line complexity, max-statements
	#handleInput(deltaTime) {
		if (InputUtils.isKeyDown(Key.ARROW_UP)) {
			this.rotate(true);
		} else if (InputUtils.isKeyDown(Key.ENTER)) {
			this.rotate(false);
		}

		// Increase the horizontal movement speed
		const multiplier = InputUtils.isKeyDown(Key.SHIFT) ? 1.5 : 1;

		// Really fast button trigger, move instantly
		if (InputUtils.isKeyDownOneshot(Key.ARROW_LEFT)) {
			this.position.x = Math.ceil(this.drawPosition.x) - 1;
			this.move({ x: 0, y: 0 });
			this.drawPosition.x = this.position.x;
		} else if (InputUtils.isKeyDown(Key.ARROW_LEFT)) {
			this.move({ x: -PIECE_MOVING_SPEED * deltaTime * multiplier, y: 0 });
		}

		if (InputUtils.isKeyDownOneshot(Key.ARROW_RIGHT)) {
			this.position.x = Math.floor(this.drawPosition.x) + 1;
			this.move({ x: 0, y: 0 });
			this.drawPosition.x = this.position.x;
		} else if (InputUtils.isKeyDown(Key.ARROW_RIGHT)) {
			this.move({ x: PIECE_MOVING_SPEED * deltaTime * multiplier, y: 0 });
		}

		/* if (!InputUtils.isKeyDown(Key.ARROW_LEFT) && !InputUtils.isKeyDown(Key.ARROW_RIGHT)) {
			this.position.x = Math.floor(this.position.x) + 0.5;
		} */

		if (InputUtils.isKeyDown(Key.ARROW_DOWN)) {
			this.move({ x: 0, y: PIECE_MOVING_SPEED * deltaTime * 2 * multiplier });
		} else if (InputUtils.isKeyDown(Key.SPACE)) {
			this.#hardDrop();
		}
	}

	#hardDrop() {
		const remainingRows = Math.ceil(this.game.board.rows - this.height - this.position.y);
		this.position.y = Math.ceil(this.position.y);
		this.drawPosition.y = this.position.y;
		let offset = 0;

		for (let i = 0; i < remainingRows; i++) {
			// Increase it
			offset++;

			// Check for collisions with other pieces
			if (this.game.board.checkShapeCollision(this, offset)) {
				break;
			}

			// Check for collisions with the board's bottom line
			if (this.position.y + offset + this.height > this.game.board.rows) {
				break;
			}
		}

		offset--;
		this.position.y += offset;
		this.drawPosition.y = this.position.y;
	}

	/**
	 * Moves the piece by the given amount
	 *
	 * @param {object} obj
	 * @param {number} [obj.x]
	 * @param {number} [obj.y]
	 *
	 * @return {boolean} True when the move is valid
	 */
	// eslint-disable-next-line max-statements
	move({ x = 0, y = 0 }) {
		const board = this.game.board;

		// Apply the movement to the piece
		this.position.x += x;
		this.position.y += y;

		// Check for collisions
		if (board.checkShapeCollision(this)) {
			// If there is a collision, undo the movement
			this.position.x -= x;
			this.position.y -= y;

			return false;
		}

		// Check for board boundaries
		let collided = false;
		if (this.x < 0) {
			this.position.x = 0;
			collided = true;
		} else if (this.x + this.width > board.columns) {
			this.position.x = board.columns - this.width;
			collided = true;
		}

		if (this.y < 0) {
			this.position.y = 0;
			collided = true;
		} else if (this.y + this.height > board.rows) {
			this.position.y = board.rows - this.height;
			collided = true;
		}

		return !collided;
	}

	/**
	 * Rotates the piece
	 *
	 * @param {boolean} clockwise Wether to rotate clockwise or anti-clockwise
	 */
	rotate(clockwise) {
		if (clockwise)
			this.shape = this.shape.transpose().reverseRows();
		else
			this.shape = this.shape.reverseRows().transpose();
	}

	get color() {
		return this.game.currentLevel.getColorForPiece(this.type);
	}

	get width() {
		return this.shape[0].length;
	}

	get height() {
		return this.shape.length;
	}

	get x() {
		return Math.floor(this.position.x);
	}

	get y() {
		return Math.floor(this.drawPosition.y);
	}

}