const CONSUMED_EVENTS = ["keyup", /* "keypress", */ "keydown"];

export class InputController {

	constructor() {
		this.consumedKeyCodes = Object.values(Keys);
		this.consumedKeyIds = Object.keys(Keys);

		this.pressedKeys = [];
		this.eventBuffer = [];

		CONSUMED_EVENTS.forEach((e) => {
			window.addEventListener(e, this.#onKey.bind(this));
		});
	}

	#onKey(event) {
		// Verify if the event of this key is buffered
		// This is important to only handle an event once
		// Ignoring duplicates, which would be a problem in Menu or GameOver screens
		// If the user kept a key pressed the screen would simply skip itself
		const cached = this.eventBuffer.find((x) => x.code === event.code);
		if (cached) {
			if (cached.type === event.type) {
				// If the buffered event is the same type of the new event, ignore it
				return;
			} else {
				// Change the buffered event type and continue
				cached.type = event.type;
			}
		} else {
			// The event wasn't buffered before, add it to the event buffer
			this.eventBuffer.push({ type: event.type, code: event.code });
		}

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

	resetAllKeys() {
		this.pressedKeys = [];
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
