export class MouseUtils {

	static position = { x: 0, y: 0 };

	static isPressed = false;

	static attachHooks(element) {
		element.addEventListener("mousedown", this.#onMouseDown.bind(this));
		element.addEventListener("mouseup", this.#onMouseUp.bind(this));
		element.addEventListener("mousemove", this.#onMouseMove.bind(this));
	}

	/**
	 * @param {MouseEvent} event
	 */
	static #onMouseDown(event) {
		this.position.x = event.clientX;
		this.position.y = event.clientY;
		this.isPressed = true;
	}

	/**
	 * @param {MouseEvent} event
	 */
	static #onMouseUp(event) {
		this.position.x = event.clientX;
		this.position.y = event.clientY;
		this.isPressed = false;
	}

	/**
	 * @param {MouseEvent} event
	 */
	static #onMouseMove(event) {
		this.position.x = event.clientX;
		this.position.y = event.clientY;
	}

}