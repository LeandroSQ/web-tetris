export class Level {

	static list = [];

	constructor({ speed, pieces, page }) {
		this.speed = speed;
		this.page = page;
		this.pieces = pieces;
	}

	applyPageColors() {
		const root = document.documentElement;

		root.style.setProperty("--background", this.page.background);
		root.style.setProperty("--foreground", this.page.foreground);
	}

	getColorForPiece(index) {
		return {
			background: this.pieces.background[index % this.pieces.background.length],
			border: this.pieces.border[index % this.pieces.border.length]
		};
	}

}