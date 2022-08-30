// Define constants
const green = "#ea36afF0";
const magenta = "#75fa69F0";
const maxOffset = 2;

export class TextUtils {

	static #offsetX = 0;
	
	static #offsetY = 0;

	/**
	 * Draws text simulating an CRT display
	 *
	 * @param {Object} obj
	 * @param {CanvasRenderingContext2D} obj.ctx
	 * @param {string} obj.text
	 * @param {Number} obj.x
	 * @param {Number} obj.y
	 * @param {string} obj.color
	 * @param {string} obj.fontFamily
	 * @param {Number} obj.fontSize
	 */
	// eslint-disable-next-line max-statements
	static drawCRT({ ctx, text, x, y, color="#fff", fontFamily=null, fontSize=12, centered=true }) {
		const offset = () => Math.random() - 0.5;

		ctx.font = `${fontSize}pt ${fontFamily}`;

		this.#offsetX = Math.clamp(this.#offsetX + offset(), -maxOffset, maxOffset);
		this.#offsetY = Math.clamp(this.#offsetY + offset(), -maxOffset, maxOffset);

		// Set the canvas to be blurred
		ctx.save();
		if (Math.random() <= 0.5) ctx.filter = "blur(3px)";

		// Draws green text
		ctx.fillStyle = green;
		if (centered) {
			ctx.fillTextCentered(text, x + this.#offsetX, y + this.#offsetY);
		} else {
			ctx.fillText(text, x + this.#offsetX, y + this.#offsetY);
		}

		// Draws magenta text
		ctx.fillStyle = magenta;
		if (centered) {
			ctx.fillTextCentered(text, x + this.#offsetX * -1, y + this.#offsetY * -1);
		} else {
			ctx.fillText(text, x + this.#offsetX * -1, y + this.#offsetY * -1);
		}

		// Restore canvas filter
		ctx.restore();

		// Draws the main text
		ctx.fillStyle = color;
		if (centered) {
			ctx.fillTextCentered(text, x, y);
		} else {
			ctx.fillText(text, x, y);
		}
	}

}