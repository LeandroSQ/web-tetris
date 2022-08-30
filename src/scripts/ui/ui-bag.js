import { CELL_RADIUS, EMPTY_CELL_BORDER, UI_PANEL_BACKGROUND } from "../constants";
import { Main } from "../main";
import { Piece } from "../model/piece";
import { LocaleUtils } from "../util/locale";
import { RandomBag } from "../util/random-bag";
import { TextUtils } from "../util/text";
import { DensityCanvas } from "../widget/density-canvas";
import { UIPanel } from "./ui-panel";

export class UIBag extends UIPanel {

	/**
	 * @param {Main} game
	 */
	constructor(game) {
		super();

		this.lastPiece = null;
		this.buffer = new DensityCanvas();

		this.game = game;
	}

	calculateSize({ width, height }) {
		this.position = {
			x: width + this.padding,
			y: this.game.board.cellSize * 5 + this.padding,
		};

		this.size = {
			width: this.game.board.cellSize * 4,
			height: this.game.board.cellSize * 4,
		};

		// Resize the buffer
		this.buffer.setSize({
			width: this.size.width,
			height: this.size.height - 70,
		});
	}

	update(deltaTime) {
		const nextPiece = RandomBag.peek();
		if (this.lastPiece != nextPiece) {
			// Get the buffer context
			const ctx = this.buffer.context;
			// Calculate the cell size, scaled
			const cellSize = this.game.board.cellSize * 0.75;

			// Clear the previous drawn piece
			this.buffer.clear();

			// Create a fake piece to render
			const piece = new Piece();
			piece.shape = nextPiece.shape;
			piece.height = piece.shape.length;
			piece.width = piece.shape[0].length;
			piece.drawPosition = {
				x: (this.size.width / 2 - (piece.width * cellSize) / 2) / cellSize,
				y: ((this.buffer.height) / 2 - (piece.height * cellSize) / 2) / cellSize
			};
			piece.color = this.game.currentLevel.getColorForPiece(nextPiece.type);

			// Render the fake piece to the buffer
			piece.render(ctx, cellSize);
		}
	}

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
			text: LocaleUtils.get("next"),
			x: this.size.width / 2,
			y: 40,
			fontFamily: "Nintendoid1",
			fontSize: 15.5 * window.fontScale,
			color: "#fefefe",
		});


		this.buffer.drawBufferTo(0, this.bufferPadding, ctx);


		ctx.restore();
	}

	get bufferPadding() {
		return 120;
	}

	get padding() {
		return 20;
	}

}