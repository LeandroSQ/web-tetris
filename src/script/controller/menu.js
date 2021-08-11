import { TextUtils } from "../util/text.js";
import { AudioUtils } from "../util/audio.js";
import { InputUtils } from "../util/input.js";
import { UIUtils } from "../util/ui.js";
import { SoundEffect } from "./../enum/sound-effect.js";
import { GameState } from "../enum/game-state.js";

export class MenuController {

	constructor(game) {
		this.game = game;
		this.themeSongPlaying = false;
	}

	loop(deltaTime) {
		if (InputUtils.isAnyKeyDown()) {
			// Start the theme song
			if (!this.themeSongPlaying) {
				// Play the theme song in loop
				AudioUtils.play({
					audio: SoundEffect.THEME,
					loop: true,
					volume: 0.05,
					cache: false
				});

				this.themeSongPlaying = true;
			}

			// Change the game state
			this.game.state = GameState.PLAYING;

			// Shows the UI
			UIUtils.setVisibility(true);
		}
	}

	render() {
		const ctx = this.game.ctx;
		const canvas = this.game.canvas;

		// Renders the grid
		this.game.renderGrid();

		// Dims the canvas
		ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Define the string to be drawn
		const title = "TETRIS";
		const subtitle = "Press any key to start";

		TextUtils.drawCRT({
			ctx,
			text: title,
			x: canvas.width / 2,
			y: canvas.height / 2 - 25,
			fontFamily: "Nintendoid1",
			fontSize: 42.5,
			color: "#fefefe"
		});

		TextUtils.drawCRT({
			ctx,
			text: subtitle,
			x: canvas.width / 2,
			y: canvas.height / 2 + 10,
			fontFamily: "Nintendoid1",
			fontSize: 10,
			color: "#fefefe"
		});
	}

}