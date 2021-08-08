const CONSUMED_EVENTS = ["keyup", "keypress", "keydown"];

export class InputController {

	constructor() {
		this.consumedKeyCodes = Object.values(Keys);
		this.consumedKeyIds = Object.keys(Keys);

		this.pressedKeys = [];

		CONSUMED_EVENTS.forEach((e) => {
			window.addEventListener(e, this.#onKey.bind(this));
		});
	}

	#onKey(event) {
		// Get the index of the event key from the Keys enum
		const keyCodeIndex = this.consumedKeyCodes.indexOf(event.code);
		// Ignore undefined keys
		if (keyCodeIndex === -1) return;

		const pressedKeysIndex = this.pressedKeys.indexOf(event.code);

		if (event.type == "keyup") {// Handles key up events
			// If on the pressed keys list, remove it
			if (pressedKeysIndex !== -1) this.pressedKeys.splice(pressedKeysIndex, 1);
		} else if (pressedKeysIndex === -1) {// Handles key down event
			this.pressedKeys.push(event.code);
		}
	}

	isKeyDown(key) {
		return this.pressedKeys.indexOf(key) !== -1;
	}

	isAnyKeyDown() {
		return this.pressedKeys.length > 0;
	}

	resetKey(key) {
		const index = this.pressedKeys.indexOf(key);
		if (index !== -1) this.pressedKeys.splice(index, 1);
	}

	/**
	 * Retrieves an existing singleton instance of the InputController
	 * Or creates a new one
	 *
	 * @return {InputController} The singleton instance of the InputController
	 */
	static get instance() {
		if (!window.inputControllerInstance) window.inputControllerInstance = new InputController();

		return window.inputControllerInstance;
	}
}

export const Keys = {
	"ARROW_UP": "ArrowUp",
	"ARROW_DOWN": "ArrowDown",
	"ARROW_LEFT": "ArrowLeft",
	"ARROW_RIGHT": "ArrowRight",
};
