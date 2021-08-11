import { ColorUtils } from "../util/color.js";
import { PIECE_FALLING_SPEED, PIECE_MOVING_SPEED } from "../constants.js";
import { InputUtils } from "../util/input.js";
import { BasePiece } from "./base-piece.js";
import { Key } from "../enum/key.js";
import { Tetrominoes } from "./tetromino.js";

/**
 * @property {GameController} game
 * @property {Piece.types} type
 * @property {Array<Array<Number>>} shape
 * @property {string} color
 * @property {Object} position
 * @property {Number} position.x
 * @property {Number} position.y
 **/
export class Piece extends BasePiece {

	/**
	 * @param {Tetromino} tetromino
	 * @param {GameController} game
	 **/
	constructor(tetromino, game) {
		super();

		this.game = game;

		if (tetromino) {
			this.type = tetromino.type;
			this.shape = tetromino.shape;
			// this.color = ColorUtils.getColor(this.type, this.game.gamePlay.levelIndex);

			this.position = {
				x: game.grid.columns / 2 - this.width / 2,
				y: -1
			};

			this.drawPosition = { x: this.position.x, y: this.position.y };
		}
	}

	#animateTranslation(deltaTime) {
		const speed = PIECE_MOVING_SPEED * deltaTime;

		this.drawPosition.x = Math.lerp(this.drawPosition.x, Math.floor(this.position.x), speed);
		this.drawPosition.y = Math.lerp(this.drawPosition.y, Math.ceil(this.position.y), speed * 2);
	}

	loop(deltaTime) {
		this.#animateTranslation(deltaTime);

		// Handles the user input
		this.#handleInput(deltaTime);

		// Apply the falling speed to the piece
		this.move({ x: 0, y: PIECE_FALLING_SPEED * deltaTime * this.game.speed });
	}

	#handleInput(deltaTime) {
		// Controls the piece based on input
		if (InputUtils.isKeyDown(Key.ARROW_UP)) {
			this.rotate();
		}

		if (InputUtils.isKeyDown(Key.ARROW_LEFT)) {
			this.move({ x: -PIECE_MOVING_SPEED * deltaTime, y: 0 });
		}

		if (InputUtils.isKeyDown(Key.ARROW_RIGHT)) {
			this.move({ x: PIECE_MOVING_SPEED * deltaTime, y: 0 });
		}

		if (InputUtils.isKeyDown(Key.ARROW_DOWN)) {
			this.move({ x: 0, y: PIECE_MOVING_SPEED * deltaTime * 2 });
		}
	}

	move({ x, y }) {
		this.position.x += x;
		this.position.y += y;

		if (this.game.grid.checkShapeCollision(this)) {
			this.position.x -= x;
			this.position.y -= y;

			return;
		}

		if (this.position.x <= 0) this.position.x = 0;
		else if (this.position.x + this.width > this.game.grid.columns) this.position.x = this.game.grid.columns - this.width;

		if (this.position.y <= 0) this.position.y = 0;
		else if (this.position.y + this.height > this.game.grid.rows) this.position.y = this.game.grid.rows - this.height;
	}

	rotate() {
		this.shape = this.shape.transpose().reverseRows();
	}

	get color() {
		return ColorUtils.getColor(this.type, this.game.gamePlay.levelIndex);
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
