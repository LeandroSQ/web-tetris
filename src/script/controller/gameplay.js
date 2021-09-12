import { GhostPiece } from "../model/ghost-piece.js";
import { Piece } from "../model/piece.js";
import { AudioUtils } from "../util/audio.js";
import { SoundEffect } from "../enum/sound-effect.js";
import { UIElement } from "../enum/ui-element.js";
import { InputUtils } from "../util/input.js";
import { UIUtils } from "../util/ui.js";
import { Key } from "../enum/key.js";
import { GameState } from "../enum/game-state.js";
import { RandomBag } from "../util/random-bag.js";
import { ComboParticle } from "../particle/combo-particle.js";
import { ExplosionParticle } from "../particle/explosion-particle.js";
import { Level } from "../model/level.js";

export class GamePlayController {

	constructor(game) {
		this.game = game;
		this.currentPiece = null;
		this.ghostPiece = null;
		this.comboCounter = 0;
		this.linesCleared = 0;
		this.levelIndex = 0;
		this.piecesPlaced = 0;
	}

	#nextPiece() {
		// Generate a random piece
		const tetromino = RandomBag.pop();
		this.currentPiece = new Piece(tetromino, this.game);
		this.ghostPiece = new GhostPiece(this.currentPiece);
	}

	#onPlacePiece() {
		// Play sound
		AudioUtils.play({
			audio: SoundEffect.PLACE_BLOCK,
			pitch: 1 + Math.random() * 0.5 - 0.25
		});

		// Save current piece position
		const placePosition = {
			x: Math.clamp((this.currentPiece.x + this.currentPiece.width / 2) * this.game.cellSize, 0),
			y: this.currentPiece.y * this.game.cellSize
		};

		// If the user is pressing down while placing (And future for hard drop as well)
		// Spawn explosion particles at the landing position
		if (InputUtils.isKeyDown(Key.ARROW_DOWN)) {
			ExplosionParticle.create(
				this.game.particle,
				this.game.cellSize,
				this.currentPiece
			);
		}

		// Releases the down key
		InputUtils.resetAllKeys();

		// Place the piece
		this.game.grid.place(this.currentPiece);

		// Increments the score
		this.game.score++;
		UIUtils.set(UIElement.SCORE, this.game.score);

		// Gets the next piece from the bag
		this.#nextPiece();

		// Check if the new piece already touched any piece
		if (this.game.grid.isAnyCellBellowShape(this.currentPiece)) {
			this.#onGameOver();
		} else {
			// Check if the user has made an tetris
			const score = this.game.grid.removeFilledRows();
			if (score > 0) {
				// If tetris in a row, spawn combo particle
				if (this.comboCounter > 0) {
					this.game.particle.add(new ComboParticle({ x: placePosition.x, y: placePosition.y - 20, game: this.game }));
				}

				// Handle tetris
				this.#onTetris(score);
			} else {
				// Reset the combo conter
				this.comboCounter = 0;
			}

			// Increment the pieces placed count
			this.piecesPlaced++;
			UIUtils.set(UIElement.PIECES, this.piecesPlaced);
		}

		// Invalidates the buffer
		this.game.invalidateGridBuffer();
	}

	#onGameOver() {
		// Plays the audio
		AudioUtils.play({
			audio: SoundEffect.GAME_OVER
		});

		// Set the game state
		this.game.state = GameState.GAMEOVER;

		// Reset all key presses
		InputUtils.resetAllKeys();
	}

	#onLevel() {
		// Apply page colors
		Level.list[this.levelIndex].applyPageColors();

		// Grays out grid
		this.game.grid.setColorForAllCells("#d0d0d0", "#aaa");
	}

	#onTetris(linesCleared) {
		// Increment the lines removed counter
		this.linesCleared += linesCleared;
		UIUtils.set(UIElement.LINES, this.linesCleared);

		// Check level
		if (this.linesCleared % 10 == 0) {
			this.levelIndex = Math.clamp(this.levelIndex + 1, 0, Level.list.length - 1);
			this.#onLevel();
		}

		// Increases the game score
		const level = this.levelIndex + 1;
		const comboModifier = 100 * this.comboCounter * level;
		const newScore = Math.pow(linesCleared, 2) * 100 * level + comboModifier;
		this.game.score += newScore;

		// Updates the element
		UIUtils.addPoints(newScore, this.game.score);

		// Increment the combo counter
		this.comboCounter++;

		// Play the tetris sound
		// Calculate the pitch shifting, the more lines removed higher the pitch
		const pitch = 0.75 + 0.25 * Math.min(linesCleared / 3, 1);
		AudioUtils.play({
			audio: SoundEffect.SCORE,
			pitch: pitch
		});
	}

	reset() {
		// Reset the Random bag
		RandomBag.reset();

		// Gets the starting piece
		this.#nextPiece();

		// Reset variables
		this.comboCounter = 0;
		this.linesCleared = 0;
		this.levelIndex = 0;
		this.piecesPlaced = 0;

		this.#onLevel();
	}

	loop(deltaTime) {
		// Updates the current piece
		this.currentPiece.loop(deltaTime);

		if (InputUtils.isKeyDown(Key.ESCAPE)) {
			this.game.state = GameState.PAUSED;
			InputUtils.resetKey(Key.ESCAPE);
			
			return;
		}

		// Checks if the current piece is about to collide
		if (this.game.grid.isAnyCellBellowShape(this.currentPiece) || this.currentPiece.y + this.currentPiece.height >= this.game.grid.rows) {
			this.#onPlacePiece();
		} else {
			// Updates the ghost piece
			this.ghostPiece.loop(this.game.grid);
		}

		// Resets the keypress of the UP key
		InputUtils.resetKey(Key.ARROW_UP);
	}

	render() {
		const ctx = this.game.ctx;

		// Renders the grid
		this.game.renderGrid();

		// Render the current piece
		this.currentPiece.render(ctx, this.game.cellSize);

		// Renders the ghost piece
		this.ghostPiece.render(ctx, this.game.cellSize);
	}

}