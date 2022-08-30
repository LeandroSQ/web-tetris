export class DensityCanvas {

	constructor() {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.virtualWidth = null;
		this.virtualHeight = null;
		this.enableHighDPI = true;
	}

	#getBackingStoreRatio(context) {
		if (!this.enableHighDPI) return 1;

		return context.webkitBackingStorePixelRatio ||
				context.mozBackingStorePixelRatio ||
				context.msBackingStorePixelRatio ||
				context.oBackingStorePixelRatio ||
				context.backingStorePixelRatio ||
				1;
	}

	#getDevicePixelRation() {
		if (!this.enableHighDPI) return 1;

		return window.devicePixelRatio || 1;
	}

	#getDrawRatio(backingStoreRatio, devicePixelRatio) {
		return devicePixelRatio / backingStoreRatio;
	}

	// eslint-disable-next-line max-statements
	setSize({ width, height }) {
		// Calculate the display density pixel ratio
		const backingStoreRatio = this.#getBackingStoreRatio(this.context);
		const devicePixelRatio = this.#getDevicePixelRation();
		this.drawRatio = this.#getDrawRatio(backingStoreRatio, devicePixelRatio);

		// Set the canvas size
		if (backingStoreRatio !== devicePixelRatio) {
			// Set the virtual canvas size to the real resolution
			this.canvas.width = width * this.drawRatio;
			this.canvas.height = height * this.drawRatio;

			// Set the presented canvas size to the visible resolution
			this.canvas.style.width = `${width}px`;
			this.canvas.style.minWidth = `${width}px`;
			this.canvas.style.height = `${height}px`;
			this.canvas.style.minHeight = `${height}px`;
		} else {
			// 1:1 ratio, just scale it
			this.canvas.width = width;
			this.canvas.height = height;

			this.canvas.style.width = "";
			this.canvas.style.height = "";
		}

		// Scale the canvas according to the ratio
		this.context.scale(this.drawRatio, this.drawRatio);

		// Save the virtual size of the canvas
		this.virtualWidth = width;
		this.virtualHeight = height;
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Draws this canvas to a given context
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {CanvasRenderingContext2D} ctx
	 */
	drawBufferTo(x, y, ctx) {
		ctx.save();
		ctx.scale(1 / this.drawRatio, 1 / this.drawRatio);
		ctx.drawImage(this.canvas, x, y);
		ctx.restore();
	}

	/**
	 * Attaches the canvas element as child to a given HTMLElement
	 *
	 * @param {HTMLElement} element The parent element to attach the canvas
	 */
	attachToElement(element) {
		element.appendChild(this.canvas);
	}

	get width() {
		return this.virtualWidth || this.canvas.width;
	}

	get height() {
		return this.virtualHeight || this.canvas.height;
	}

}