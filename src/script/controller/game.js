import { Grid } from "../model/grid.js";
import { DensityCanvas } from "../widget/density-canvas.js";
import { GRID_COLS, GRID_PADDING, GRID_ROWS, TARGET_FRAMETIME } from "../constants.js";
import { UIUtils } from "../util/ui.js";
import { MenuController } from "./menu.js";
import { GameOverController } from "./gameover.js";
import { GamePlayController } from "./gameplay.js";
import { GameState } from "../enum/game-state.js";
import { ParticleController } from "./particle.js";
import { PauseController } from "./pause.js";
import { Level } from "../model/level.js";

export class GameController {

	constructor() {
		// Get the canvas element and it's context
		this.canvasWrapper = document.getElementById("wrapper");
		this.canvas = new DensityCanvas();
		this.canvas.attachToElement(this.canvasWrapper);
		this.ctx = this.canvas.context;

		// Define the controllers
		this.menu = new MenuController(this);
		this.gameOver = new GameOverController(this);
		this.gamePlay = new GamePlayController(this);
		this.paused = new PauseController(this);
		this.particle = new ParticleController(this);

		// Define the initial game state
		this.state = GameState.MENU;
	}

	setup() {
		// Reset variables
		this.reset();

		// Calculate the canvas size
		this.calculateSizing();

		// Starts the render loop
		this.#onFrame();
	}

	reset() {
		// Reset the constants
		this.score = 0;

		// Define the grid
		this.grid = new Grid({ rows: GRID_ROWS, columns: GRID_COLS });

		// Reset the level
		this.gamePlay.reset();

		// Kill all particles
		this.particle.reset();

		// Invalidates the buffer
		this.invalidateGridBuffer();

		// Reset the UI
		UIUtils.reset();
	}

	invalidateGridBuffer() {
		// Invalidates the buffer
		this.gridCanvasBuffer = null;
		this.renderGrid();
	}

	#clearCanvas() {
		// Clears the canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	#onFrame() {
		// Calculate the delta time, from the last frame to the current loop time
		const deltaTime = (performance.now() - this.lastUpdateTime) / TARGET_FRAMETIME;

		switch (this.state) {

			case GameState.MENU:
				this.menu.loop(deltaTime);
				this.#clearCanvas();
				this.menu.render();
				break;

			case GameState.PLAYING:
				this.gamePlay.loop(deltaTime);
				this.#clearCanvas();
				this.gamePlay.render();
				break;

			case GameState.GAMEOVER:
				this.gameOver.loop(deltaTime);
				this.#clearCanvas();
				this.gameOver.render();
				break;

			case GameState.PAUSED:
				this.paused.loop(deltaTime);
				this.#clearCanvas();
				this.paused.render();
				break;

		}

		// Renders the particles
		this.particle.loopAndRender(deltaTime, this.ctx, this.cellSize);

		// Saves the last frame update time
		this.lastUpdateTime = performance.now();

		// Schedule the next frame
		requestAnimationFrame(this.#onFrame.bind(this));
	}

	onFocus() {
		if (this.state !== GameState.PLAYING) return;

		// Reset the last update time, therefore the delta timing will not consider the not focused
		// window time as an update
		this.lastUpdateTime = 0;

		this.state = GameState.PAUSED;
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

	renderGrid() {
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

	get speed() {
		return Level.list[this.gamePlay.levelIndex].speed;
	}

}