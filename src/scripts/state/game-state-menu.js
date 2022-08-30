import { InputUtils } from "../util/input";
import { Main } from "../main";
import { AudioUtils } from "../util/audio";
import { SoundEffect } from "../enum/sound-effect";
import { CELL_RADIUS } from "../constants";
import { TextUtils } from "../util/text";
import { GameState } from "./game-state";
import { GameStateType } from "./../enum/game-state-type";
import { Setting } from "../enum/setting";
import { PreferenceUtils } from "../util/preference";
import { LocaleUtils } from "../util/locale";
import { ImageUtils } from "../util/image";

const TRANSITION_DURATION = 0.4;

export class GameStateMenu extends GameState {

	/**
	 * @param {Main} game
	 */
	constructor(game) {
		super();

		this.isTransitioning = false;
		this.transitionTimer = 0;
		this.progress = 1;

		this.game = game;
		this.isThemePlaying = false;

		/* ImageUtils.load("ic_cog.svg")
				  .then(img => this.iconCog = img); */
	}

	update(deltaTime) {
		// Update transition to GameStatePlaying
		if (this.isTransitioning) {
			this.transitionTimer += deltaTime;

			if (this.transitionTimer > TRANSITION_DURATION) {
				this.transitionTimer = TRANSITION_DURATION;
				// Changes the game state
				this.game.state = GameStateType.PLAYING;
				this.game.statePlaying.reset();
				InputUtils.resetAllKeys();
			}

			this.progress = Math.pow(1 - this.transitionTimer / TRANSITION_DURATION, 2.5);

			return;
		}

		// Detect user input
		if (InputUtils.isAnyKeyDown()) {
			// Starts the theme song
			this.#playGameStartSong();

			this.isTransitioning = true;
		}

		// Update cog

	}

	render(ctx) {
		// Dims the canvas
		ctx.fillStyle = `rgba(0, 0, 0, ${0.35 * this.progress})`;
		// ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

		ctx.save();
		ctx.translate((this.game.canvas.width / 2 - this.game.board.width / 2) * (this.progress), 0);
		ctx.beginPath();
		ctx.fillRoundRect(0, 0, this.game.board.width, this.game.board.height, [CELL_RADIUS]);
		this.game.board.render(ctx);

		// Draw title
		TextUtils.drawCRT({
			ctx,
			text: LocaleUtils.get("tetris"),
			x: this.game.board.width / 2,
			y: this.game.board.height / 2 - 25,
			fontFamily: "Nintendoid1",
			fontSize: 45 * window.fontScale,
			color: "#fefefe",
		});

		// Draw subtitle
		TextUtils.drawCRT({
			ctx,
			text: LocaleUtils.get("press_any_key_to_start"),
			x: this.game.board.width / 2,
			y: this.game.board.height / 2 + 10,
			fontFamily: "Nintendoid1",
			fontSize: 8 * window.fontScale,
			color: "#fefefe",
		});

		// Draw cog
		/* ctx.translate(this.game.board.width, this.game.board.height)
		ctx.scale(window.fontScale, window.fontScale);
		ctx.drawImage(
			this.iconCog,
			-this.iconCog.width * 1.5,
			-this.iconCog.height * 1.5
		); */

		ctx.restore();
	}

	async #playGameStartSong() {
		if (PreferenceUtils.getSetting(Setting.SOUND_EFFECTS_ENABLED)) {
			await AudioUtils.play({
				audio: SoundEffect.START_GAME,
				volume: 0.15,
				loop: false,
				cache: false,
				onStart: () => {
					this.#rumbleStartSong();
				},
				onEnd: () => {
					this.#startThemeSong();
				},
			});
		} else {
			await this.#rumbleStartSong();
			await this.#startThemeSong();
		}
	}

	async #rumbleStartSong() {
		// 1000 - 16 beats
		const beat = 1000 / 16;
		const doubleBeat = beat * 2;
		const quadrupleBeat = beat * 4;
		await InputUtils.rumbleSequence([
			{ force: 1.0, duration: doubleBeat, delay: 0 },
			{ force: 0.5, duration: doubleBeat, delay: beat },
			{ force: 0.5, duration: doubleBeat, delay: 0 },
			{ force: 0.5, duration: doubleBeat, delay: 0 },
			{ force: 0.5, duration: doubleBeat, delay: 0 },
			{ force: 1.0, duration: doubleBeat, delay: beat },
			{
				force: 1.0,
				duration: doubleBeat,
				delay: quadrupleBeat,
			},
			{ force: 1.0, duration: doubleBeat, delay: beat },
		]);
	}

	async #startThemeSong() {
		if (!PreferenceUtils.getSetting(Setting.MUSIC_ENABLED)) return;
		if (this.isThemePlaying) return;

		this.isThemePlaying = true;

		AudioUtils.play({
			audio: SoundEffect.THEME,
			loop: true,
			volume: 0.05
		});
	}

}