import { Grid } from "../model/grid.js";
import { Piece } from "../model/piece.js";
import { DensityCanvas } from "../widget/density-canvas.js";
import { GRID_COLS, GRID_PADDING, GRID_ROWS, TARGET_FRAMETIME } from "../constants.js";
import { InputController, Keys } from "./input.js";
import { AudioController, SoundFX } from "./audio.js";
import { ScoreController } from "./score.js";

export class GameController {

	constructor() {
		// Get the canvas element and it's context
		this.canvasWrapper = document.getElementById("wrapper");
		this.canvas = new DensityCanvas();
		this.canvas.attachToElement(this.canvasWrapper);
		this.ctx = this.canvas.context;
		this.speed = 2;
		this.lastUpdateTime = 0;
		this.running = true;
		this.piecesPlaced = 0;
		this.score = 0;

		this.gridCanvasBuffer = null;

		// Define the grid
		this.grid = new Grid({ rows: GRID_ROWS, columns: GRID_COLS });
		this.currentPiece = Piece.random(this);
	}

	setup() {
		this.calculateSizing();

		// Starts the render loop
		this.#scheduleNextLoop();

		// Play the theme song in loop
		setTimeout(() => {
			AudioController.instance.play({
				audio: SoundFX.THEME,
				loop: true,
				volume: 0.05,
				cache: false
			});
		}, 500);
	}

	calculateSizing() {
		// Invalidates the buffer
		this.gridCanvasBuffer = null;

		// Fetch the window size
		const width = Math.floor(document.body.clientWidth - GRID_PADDING * 2);
		const height = Math.floor(document.body.clientHeight - GRID_PADDING * 2);

		// Calculate the grid size
		const gridCellWidth = width / this.grid.columns;
		const gridCellHeight = height / this.grid.rows;

		// The minimum value gets to be the cell both height and width, therefore
		// all the cells will be a perfect square
		this.cellSize = Math.min(gridCellWidth, gridCellHeight);

		// Update the canvas size
		this.canvas.setSize({
			width: this.grid.columns * this.cellSize,
			height: this.grid.rows * this.cellSize
		});
	}

	#scheduleNextLoop() {
		requestAnimationFrame(() => {
			// Calculate the delta time
			const deltaTime = (performance.now() - this.lastUpdateTime) / TARGET_FRAMETIME;

			if (this.running) {
				// Update game
				this.#loop(deltaTime);
			} else {
				// Game over
				if (InputController.instance.isAnyKeyDown()) {
					this.#onGameReset();
				}
			}

			// Render game
			this.#render();

			// Saves the last frame update time
			this.lastUpdateTime = performance.now();
		});
	}

	#loop(deltaTime) {
		// Updates the current piece
		this.currentPiece.loop(deltaTime);

		// Checks if the current piece is about to collide
		if (this.grid.isAnyCellBellowShape(this.currentPiece) || this.currentPiece.y + this.currentPiece.height >= this.grid.rows) {
			this.#onPlacePiece();
		}

		// Resets the keypress of the UP key
		InputController.instance.resetKey(Keys.ARROW_UP);
	}

	#onPlacePiece() {
		// Play sound
		AudioController.instance.play({
			audio: SoundFX.PLACE_BLOCK,
			pitch: 1 + Math.random() * 0.5 - 0.25
		});

		// Place the piece
		this.grid.place(this.currentPiece);

		// Generate a random piece
		this.currentPiece = Piece.random(this);

		// Check if the new piece already touched any piece
		if (this.grid.isAnyCellBellowShape(this.currentPiece)) {
			this.#onGameOver();
		} else {
			// Check if the user has made an tetris
			const score = this.grid.removeFilledRows();
			if (score > 0) this.#onTetris(score);

			this.piecesPlaced++;
			this.#updateUiElement("pieces", this.piecesPlaced);
		}

		// Invalidates the buffer
		this.gridCanvasBuffer = null;
		this.#renderGrid();
	}

	#updateUiElement(id, value) {
		document.getElementById(id).innerText = value.toString();
	}

	#onTetris(score) {
		// Adds the new score
		const newScore = score * score * 100;
		this.score += newScore;

		// Updates the element
		this.#updateUiElement("score", this.score);

		ScoreController.instance.addPoints(newScore);


		// Play the tetris sound, the more lines erased the higher the pitch of the sound
		AudioController.instance.play({
			audio: SoundFX.SCORE,
			pitch: 0.75 + 0.25 * Math.min(score / 3, 1)
		});
	}

	#onGameOver() {
		AudioController.instance.play({
			audio: SoundFX.GAME_OVER
		});
		this.running = false;
	}

	#onGameReset() {
		// Rest variables
		this.grid = new Grid({ rows: GRID_ROWS, columns: GRID_COLS });
		this.currentPiece = Piece.random(this);
		this.running = true;
		this.piecesPlaced = 0;

		// Invalidates the buffer
		this.gridCanvasBuffer = null;
		this.#renderGrid();
	}

	#render() {
		// Clears the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Render the grid lines
		this.#renderGrid();

		// Renders the current piece
		this.currentPiece.render(this.ctx, this.cellSize);

		this.#scheduleNextLoop();
	}

	#renderGrid() {
		// If the buffer is already defined, just draw it to the canvas
		if (this.gridCanvasBuffer) {
			this.gridCanvasBuffer.drawBufferTo(0, 0, this.ctx);

			return;
		}

		// Generate the canvas buffer
		this.gridCanvasBuffer = new DensityCanvas();
		this.gridCanvasBuffer.setSize({ width: this.canvas.width, height: this.canvas.height });
		const ctx = this.gridCanvasBuffer.context;

		// Renders the grid cells into the buffer
		this.grid.render(ctx, this.cellSize);
	}

}