import { GhostPiece } from "../model/ghost-piece";
import { FallingPiece } from "../model/falling-piece";
import { RandomBag } from "../util/random-bag";
import { GameState } from "./game-state";
import { AudioUtils } from "../util/audio";
import { SoundEffect } from "../enum/sound-effect";
import { ComboParticle } from "../particle/combo-particle";
import { Main } from "../main"
import { GameStateType } from "../enum/game-state-type";
import { Level } from "../model/level";
import { InputUtils } from "../util/input";
import { Key } from "../enum/key";
import { ExplosionParticle } from "../particle/explosion-particle";
import { Cell } from "../model/cell";
import { PreferenceUtils } from "../util/preference";
import { Setting } from "../enum/setting";
import { Tetrominoes } from "../model/tetromino";

export class GameStatePlaying extends GameState {

	/**
	 * @param {Main} game
	 */
	constructor(game) {
		super();

		this.game = game;
		this.fallingPiece = null;
		this.ghostPiece = null;

		this.stats = {
			score: 0,
			linesCleared: 0,
			comboCounter: 0,
			piecesPlaced: 0,
		};
	}

	reset() {

		// Reset the Random bag
		RandomBag.reset();

		// Gets the starting piece
		this.#nextPiece();

		// Reset stats
		this.stats = {
			score: 0,
			linesCleared: 0,
			comboCounter: 0,
			piecesPlaced: 0,
		};

		this.#onLevel();
	}

	#nextPiece() {
		// Retrieve the next piece from the Random bag
		const tetromino = RandomBag.pop();
		this.fallingPiece = new FallingPiece(this.game, tetromino);
		this.ghostPiece = new GhostPiece(this.fallingPiece);
	}

	#checkForTetris(position) {
		// Check if the new piece already touched any piece
		if (this.game.board.isAnyCellBellowShape(this.fallingPiece)) {
			this.#onGameOver();
		} else {
			// Check if the user has made an tetris
			const score = this.game.board.removeFilledRows();
			if (score > 0) {
				// If tetris in a row, spawn combo particle
				if (this.stats.comboCounter > 0) {
					this.game.particleController.add(new ComboParticle({ x: position.x, y: position.y - 20, game: this.game }));
				}

				// Handle tetris
				this.#onTetris(score);
			} else {
				// Reset the combo conter
				this.stats.comboCounter = 0;
			}
		}
	}

	// #region Event handlers
	#onPlacePiece() {
		// Play sound effect
		if (PreferenceUtils.getSetting(Setting.SOUND_EFFECTS_ENABLED)) {
			AudioUtils.play({
				audio: SoundEffect.PLACE_BLOCK,
				pitch: Math.randomRange(0.75, 1.25),
			});
		}

		// Save current piece position
		const position = {
			x: Math.max((this.fallingPiece.x + this.fallingPiece.width / 2) * this.game.board.cellSize, 0),
			y: this.fallingPiece.y * this.game.board.cellSize,
		};

		// If the user is pressing down while placing spawn explosion particles at the landing position
		if (PreferenceUtils.getSetting(Setting.FALL_PARTICLES_ENABLED)) {
			if (InputUtils.isKeyDown(Key.ARROW_DOWN) || InputUtils.isKeyDown(Key.SPACE)) {
				ExplosionParticle.create(this.game.particleController, this.game.board.cellSize, this.fallingPiece);
			}
		}

		// Releases the down key
		InputUtils.resetAllKeys();

		// Place the piece
		this.game.board.place(this.fallingPiece);
		this.#nextPiece();

		// Increments the stats
		this.stats.score += this.game.currentLevelIndex + 1;;
		this.stats.piecesPlaced++;

		// Check for tetris, game over, or level up
		this.#checkForTetris(position);
	}

	#onGameOver() {
		// Play sound effect
		AudioUtils.play({ audio: SoundEffect.GAME_OVER });

		// Set the game state
		this.game.state = GameStateType.GAMEOVER;

		// Rumble gamepad
		InputUtils.rumbleSequence([
			{ force: 1.0, duration: 250, delay: 0 },
			{ force: 0.5, duration: 150, delay: 150 },
		]);

		// Reset the key presses, so any already pressed keys are not handled
		InputUtils.resetAllKeys();
	}

	#onLevel() {
		// Apply page colors
		this.game.currentLevel.applyPageColors();

		// Grays out the previous placed cells
		this.game.board.setColorForAllCells("#d0d0d0", "#aaa");
	}

	#onTetris(lineClearedCount) {
		// Increment the lines removed counter
		this.stats.linesCleared += lineClearedCount;

		// Check level
		if (this.stats.linesCleared % 10 == 0) {
			// Cycle through the levels
			this.game.currentLevelIndex = Math.clamp(this.game.currentLevelIndex + 1, 0, Level.list.length - 1);
			this.#onLevel();

			// Rumble gamepad
			InputUtils.rumble(1.0, 200);
		}

		// Increases the game score
		const level = this.game.currentLevelIndex + 1;
		const comboModifier = 100 * this.stats.comboCounter * level;
		const newScore = Math.pow(lineClearedCount, 2) * 100 * level + comboModifier;
		this.stats.score += newScore;

		// Increment the combo counter
		this.stats.comboCounter++;

		// Play the tetris sound
		// Calculate the pitch shifting, the more lines removed higher the pitch
		if (PreferenceUtils.getSetting(Setting.SOUND_EFFECTS_ENABLED)) {
			const pitch = 0.75 + 0.25 * Math.min(lineClearedCount / 3, 1);
			AudioUtils.play({
				audio: SoundEffect.SCORE,
				pitch: pitch
			});
		}
	}

	#onPaused() {
		this.game.state = GameStateType.PAUSED;
		InputUtils.resetAllKeys();
	}

	#onPieceHold() {
		const currentPiece = Tetrominoes.find(x => x.type == this.fallingPiece.type);
		const nextPiece = RandomBag.pop();

		// Swap the falling piece's shape
		this.fallingPiece.type = nextPiece.type;
		this.fallingPiece.shape = nextPiece.shape;

		// Calculate the new color offsetting the new piece's color
		this.ghostPiece.calculateColor();
		this.ghostPiece.drawPosition.x = this.fallingPiece.x + 1; // Forces to recalculate the positioning of the ghost piece

		// Put the previous piece in to the end of the stack
		RandomBag.push(currentPiece);
	}
	// #endregion

	update(deltaTime) {
		// Check if the user has paused the game
		if (InputUtils.isKeyDown(Key.ESCAPE)) {
			this.#onPaused();

			return;
		}

		// Check for holding piece request
		if (InputUtils.isKeyDown(Key.CONTROL)) {
			this.#onPieceHold();
			InputUtils.resetKey(Key.CONTROL);
		}

		// Update the falling piece
		this.fallingPiece.update(deltaTime);

		// Checks if the current piece is about to collide
		if (this.game.board.isAnyCellBellowShape(this.fallingPiece) || this.fallingPiece.y + this.fallingPiece.height >= this.game.board.rows) {
			this.#onPlacePiece();
		} else {
			// Updates the ghost piece
			this.ghostPiece.update();
		}

		// Resets the keypress of the UP key
		InputUtils.resetKey(Key.ARROW_UP);
		InputUtils.resetKey(Key.ENTER);

		// Update the particles
		this.game.particleController.update(deltaTime);

		// Update the panels
		for (const panel of this.game.uiPanels) panel.update(deltaTime);
	}

	render(ctx) {
		// Draw the board
		this.game.board.render(ctx);

		// Draw the panels
		for (const panel of this.game.uiPanels) panel.render(ctx);

		// Draw the particles
		this.game.particleController.render(ctx);

		// Draw the ghost and falling piece
		this.ghostPiece.render(ctx, this.game.board.cellSize);
		this.fallingPiece.render(ctx, this.game.board.cellSize);
	}

}