import { CELL_RADIUS, EMPTY_CELL_BACKGROUND, EMPTY_CELL_BORDER, UI_PANEL_BACKGROUND } from "../constants";
import { Main } from "../main";
import { LocaleUtils } from "../util/locale";
import { TextUtils } from "../util/text";
import { UIPanel } from "./ui-panel";

export class UIStats extends UIPanel {

	/**
	 * @param {Main} game
	 */
	constructor(game) {
		super();

		this.game = game;
	}

	calculateSize({ width, height }) {
		this.position = {
			x: width + this.padding,
			y: 0,
		};

		this.size = {
			width: this.game.board.cellSize * 4,
			height: this.game.board.cellSize * 5,
		};
	}

	update(deltaTime) {}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 */
	// eslint-disable-next-line max-statements
	render(ctx) {
		ctx.fillStyle = UI_PANEL_BACKGROUND;
		ctx.strokeStyle = EMPTY_CELL_BORDER;
		ctx.lineWidth = 1;

		ctx.save();
		ctx.translate(this.position.x, this.position.y);

		ctx.beginPath();
		ctx.roundRect(0, 0, this.size.width, this.size.height, [CELL_RADIUS]);
		ctx.fill();
		ctx.stroke();

		// Draw title
		TextUtils.drawCRT({
			ctx,
			text: LocaleUtils.get("tetris"),
			x: this.size.width / 2,
			y: 40 * window.fontScale,
			fontFamily: "Nintendoid1",
			fontSize: 15.5 * window.fontScale,
			color: "#fefefe",
		});

		ctx.fillStyle = "#fefefe";
		ctx.font = `${8 * window.fontScale}pt Nintendoid1`;

		ctx.fillText(
			LocaleUtils.get("score"),
			12.5 * window.fontScale,
			70 * window.fontScale,
			this.size.width
		);
		ctx.fillText(
			this.game.statePlaying.stats.score,
			12.5 * window.fontScale,
			90 * window.fontScale,
			this.size.width
		);

		ctx.fillText(
			LocaleUtils.get("lines"),
			12.5 * window.fontScale,
			115 * window.fontScale,
			this.size.width
		);
		ctx.fillText(
			this.game.statePlaying.stats.linesCleared,
			12.5 * window.fontScale,
			135 * window.fontScale,
			this.size.width
		);

		ctx.fillText(
			LocaleUtils.get("pieces"),
			12.5 * window.fontScale,
			160 * window.fontScale,
			this.size.width
		);
		ctx.fillText(
			this.game.statePlaying.stats.piecesPlaced,
			12.5 * window.fontScale,
			180 * window.fontScale,
			this.size.width
		);

		ctx.restore();
	}

	get padding() {
		return 20;
	}

}
