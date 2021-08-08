import { Colors } from "../util/color.js";
import { PIECE_FALLING_SPEED, PIECE_MOVING_SPEED } from "../constants.js";
import { InputController, Keys } from "../controller/input.js";

/**
 * @property {GameController} game
 * @property {Piece.types} type
 * @property {Array<Array<Number>>} shape
 * @property {string} color
 * @property {Object} position
 * @property {Number} position.x
 * @property {Number} position.y
 **/
export class Piece {

	/**
	 * @param {Piece.types} type
	 * @param {GameController} game
	 **/
	constructor(type, game) {
		this.game = game;
		this.type = type;
		this.shape = Piece.shapes[this.type].slice(0);

		this.color = Colors.random();

		this.position = {
			x: game.grid.columns / 2 - this.width / 2,
			y: 0
		};

		this.drawPosition = { x: this.position.x, y: this.position.y };
	}

	render(ctx, cellSize) {
		// Set the piece color
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#ecf0f1";
		ctx.lineWidth = 1.5;

		// Draws the piece at it's position
		ctx.translate(this.drawPosition.x * cellSize, this.drawPosition.y * cellSize);

		for (let row = 0; row < this.shape.length; row++) {
			for (let column = 0; column < this.shape[row].length; column++) {
				// Ignore empty spaces
				if (this.shape[row][column] <= 0) continue;

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
		this.move({ x: 0, y: PIECE_FALLING_SPEED * deltaTime });
	}

	#handleInput(deltaTime) {
		const input = InputController.instance;

		// Controls the piece based on input
		if (input.isKeyDown(Keys.ARROW_UP)) {
			this.rotate();
		}

		if (input.isKeyDown(Keys.ARROW_LEFT)) {
			this.move({ x: -PIECE_MOVING_SPEED * deltaTime, y: 0 });
		}

		if (input.isKeyDown(Keys.ARROW_RIGHT)) {
			this.move({ x: PIECE_MOVING_SPEED * deltaTime, y: 0 });
		}

		if (input.isKeyDown(Keys.ARROW_DOWN)) {
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

/**
 * Generates a random piece
 *
 * @param {Game} game
 * @return {Piece} The generated piece
 */
Piece.random = function(game) {
	// Fetch all possible types
	const types = Object.keys(Piece.types);

	// Pick a random type
	const typeName = types.random();

	return new Piece(Piece.types[typeName], game);
};

Piece.empty = 0;

Piece.types = {
	"L": "l",
	"REVERSED_L": "reversed_l",
	"BLOCK": "block",
	"Z": "z",
	"REVERSED_Z": "reversed_z",
	"LINE": "line",
	"T": "t",
};

Piece.shapes = {
	// L
	"l": [
		[1, 0],
		[1, 0],
		[1, 1]
	],
	// REVERSED_L
	"reversed_l": [
		[0, 1],
		[0, 1],
		[1, 1]
	],
	// BLOCK
	"block": [
		[1, 1],
		[1, 1],
	],
	// Z
	"z": [
		[1, 1, 0],
		[0, 1, 1],
	],
	// REVERSED_Z
	"reversed_z": [
		[0, 1, 1],
		[1, 1, 0],
	],
	// LINE
	"line": [
		[1],
		[1],
		[1],
		[1],
	],
	// T
	"t": [
		[1, 1, 1],
		[0, 1, 0],
	],
};