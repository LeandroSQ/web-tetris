import { Grid } from "../model/grid.js";
import { Piece } from "../model/piece.js";
import { DensityCanvas } from "../widget/density-canvas.js";
import { GRID_COLS, GRID_PADDING, GRID_ROWS, STARTING_GAME_SPEED, TARGET_FRAMETIME } from "../constants.js";
import { InputController, Keys } from "./input.js";
import { AudioController, SoundFX } from "./audio.js";
import { UIController } from "./ui.js";

export class GameController {

	constructor() {
		// Get the canvas element and it's context
		this.canvasWrapper = document.getElementById("wrapper");
		this.canvas = new DensityCanvas();
		this.canvas.attachToElement(this.canvasWrapper);
		this.ctx = this.canvas.context;
		this.themeSongPlaying = false;

		// Define the initial game state
		this.state = GameStates.MENU;
	}

	setup() {
		// Reset variables
		this.#resetPlayingState();

		// Calculate the canvas size
		this.calculateSizing();

		// Starts the render loop
		this.#onFrame();
	}

	#resetPlayingState() {
		// Reset the constants
		this.speed = STARTING_GAME_SPEED;
		this.score = 0;
		this.piecesPlaced = 0;

		// Define the grid
		this.grid = new Grid({ rows: GRID_ROWS, columns: GRID_COLS });
		this.currentPiece = Piece.random(this);

		// Invalidates the buffer
		this.#invalidateGridBuffer();
	}

	#invalidateGridBuffer() {
		// Invalidates the buffer
		this.gridCanvasBuffer = null;
		this.#renderGrid();
	}

	#clearCanvas() {
		// Clears the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	#onFrame() {
		// Calculate the delta time, from the last frame to the current loop time
		const deltaTime = (performance.now() - this.lastUpdateTime) / TARGET_FRAMETIME;

		switch (this.state) {
			case GameStates.MENU:
				this.#loopMenu(deltaTime);
				this.#clearCanvas();
				this.#renderMenu();
				break;

			case GameStates.PLAYING:
				this.#loopPlaying(deltaTime);
				this.#clearCanvas();
				this.#renderPlaying();
				break;

			case GameStates.GAMEOVER:
				this.#loopGameOver(deltaTime);
				this.#clearCanvas();
				this.#renderGameOver();
				break;
		}

		// Saves the last frame update time
		this.lastUpdateTime = performance.now();

		requestAnimationFrame(this.#onFrame.bind(this));
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

	// #region Menu
	#loopMenu(deltaTime) {
		if (InputController.instance.isAnyKeyDown()) {
			// Start the theme song
			if (!this.themeSongPlaying) {
				// Play the theme song in loop
				AudioController.instance.play({
					audio: SoundFX.THEME,
					loop: true,
					volume: 0.05,
					cache: false
				});

				this.themeSongPlaying = true;
			}

			// Change the game state
			this.state = GameStates.PLAYING;

			// Shows the UI
			UIController.instance.setVisibility(true);
		}
	}

	#renderMenu() {
		this.#renderGrid();

		this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Define the string to be drawn
		const title = "TETRIS";
		const subtitle = "Press any key to start";

		// Define the font style
		this.ctx.fillStyle = "#fefefe";

		this.ctx.font = "42.5pt Nintendoid1";
		this.ctx.fillTextCentered(title, this.canvas.width / 2, this.canvas.height / 2 - 25);

		this.ctx.font = "10pt Nintendoid1";
		this.ctx.fillTextCentered(subtitle, this.canvas.width / 2, this.canvas.height / 2 + 10);
	}
	// #endregion

	// #region Playing
	#loopPlaying(deltaTime) {
		// Updates the current piece
		this.currentPiece.loop(deltaTime);

		// Checks if the current piece is about to collide
		if (this.grid.isAnyCellBellowShape(this.currentPiece) || this.currentPiece.y + this.currentPiece.height >= this.grid.rows) {
			this.#onPlacePiece();
		}

		// Resets the keypress of the UP key
		InputController.instance.resetKey(Keys.ARROW_UP);
	}

	#renderPlaying() {
		// Renders the grid
		this.#renderGrid();

		// Render the current piece
		this.currentPiece.render(this.ctx, this.cellSize);
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

	#onPlacePiece() {
		// Play sound
		AudioController.instance.play({
			audio: SoundFX.PLACE_BLOCK,
			pitch: 1 + Math.random() * 0.5 - 0.25
		});

		// Place the piece
		this.grid.place(this.currentPiece);

		// Count grid lines and update UI
		const gridLines = this.grid.countRowsWithAtLeastOneCell();
		UIController.instance.set("lines", gridLines);

		// Generate a random piece
		this.currentPiece = Piece.random(this);

		// Check if the new piece already touched any piece
		if (this.grid.isAnyCellBellowShape(this.currentPiece)) {
			this.#onGameOver();
		} else {
			// Check if the user has made an tetris
			const score = this.grid.removeFilledRows();
			if (score > 0) this.#onTetris(score);

			// Increment the pieces placed count
			this.piecesPlaced++;
			// Update the UI
			UIController.instance.set("pieces", this.piecesPlaced);
		}

		// Invalidates the buffer
		this.#invalidateGridBuffer();
	}

	#onTetris(linesRemoved) {
		// Adds the new score
		const newScore = linesRemoved * linesRemoved * 100;
		this.score += newScore;

		this.speed = 1 + this.score / 100 * 0.25;
		console.log(this.speed);

		// Updates the element
		UIController.instance.addPoints(newScore, this.score);

		// Play the tetris sound
		// Calculate the pitch shifting, the more lines removed higher the pitch
		const pitch = 0.75 + 0.25 * Math.min(linesRemoved / 3, 1);
		AudioController.instance.play({
			audio: SoundFX.SCORE,
			pitch: pitch
		});
	}

	#onGameOver() {
		// Plays the audio
		AudioController.instance.play({
			audio: SoundFX.GAME_OVER
		});

		// Set the game state
		this.state = GameStates.GAMEOVER;

		// Reset all key presses
		InputController.instance.resetAllKeys();
	}
	// #endregion

	// #region Game over
	#loopGameOver(deltaTime) {
		if (InputController.instance.isAnyKeyDown()) {
			this.#resetPlayingState();

			this.state = GameStates.PLAYING;
		}
	}

	#renderGameOver() {
		this.#renderGrid();

		this.ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Define the string to be drawn
		const title = "GAME-OVER";
		const subtitle = "Press any key to restart";

		// Define the font style
		this.ctx.fillStyle = "#fefefe";

		this.ctx.font = "30.5pt Nintendoid1";
		this.ctx.fillTextCentered(title, this.canvas.width / 2, this.canvas.height / 2 - 25);

		this.ctx.font = "8pt Nintendoid1";
		this.ctx.fillTextCentered(subtitle, this.canvas.width / 2, this.canvas.height / 2 + 10);
	}
	// #endregion


}

export const GameStates = {
	"MENU": "menu",
	"PLAYING": "playing",
	"GAMEOVER": "gameover"
};