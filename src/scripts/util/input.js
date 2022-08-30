import { ONESHOT_BUTTON_TRIGGER_THRESHOLD } from "../constants";
import { GameStateType } from "../enum/game-state-type";
import { GamepadKey, GamepadKeyToKeyboardKey } from "../enum/gamepad-key";
import { Key } from "../enum/key";

export class InputUtils {

	/** @type {Gamepad} */
	static #connectedGamepadId = null;

	static #consumedKeyCodes = Object.values(Key);

	static #pressedKeys = [];

	static #eventBuffer = [];

	static #oneShotEventBuffer = [];

	static attachListeners() {
		// Attach the key event listeners
		window.addEventListener("keyup", this.#onKey.bind(this));
		window.addEventListener("keydown", this.#onKey.bind(this));
		window.addEventListener("gamepadconnected", this.#onGamepadConnected.bind(this));
		window.addEventListener("gamepaddisconnected", this.#onGamepadDisconnected.bind(this));
	}

	/**
	 * @param {GamepadEvent} event
	 */
	static #onGamepadConnected(event) {
		console.log(`Gamepad connected with id ${event.gamepad.index}`);
		if (this.#connectedGamepadId) {
			console.log("Ignoring due to already connected gamepad!");

			return;
		}

		this.#connectedGamepadId = event.gamepad.id;
	}

	/**
	 * @param {GamepadEvent} event
	 */
	static #onGamepadDisconnected(event) {
		console.log(`Gamepad disconnected with id ${event.gamepad.index}`);

		if (this.#connectedGamepadId === event.gamepad.id) {
			// The connected gamepad has been disconnected
			console.log("Current connected gamepad has been disconnected!");
			this.#connectedGamepadId = null;

			// Pause the game
			window.main.state = GameStateType.PAUSED;
			// TODO: Show snackbar or toast to inform it
		}
	}

	static update() {
		this.#oneShotEventBuffer.clear();
		this.#pollGamepad();
	}

	static #pollGamepad() {
		// Ignore if no Gamepad is connected
		if (!this.#connectedGamepadId) return;

		// Search for the connected Gamepad
		const gamepad = navigator.getGamepads().find((x) => x && x.id == this.#connectedGamepadId);
		if (!gamepad) return;

		// Detect button pressing/releasing
		for (const button in GamepadKey) {
			if (!GamepadKey.hasOwnProperty(button)) continue;

			const buttonIndex = GamepadKey[button];

			// Check if the gamepad button is currently pressed
			const isPressed = gamepad.buttons[buttonIndex].pressed;
			// Get it's keyboard emulation
			const keyboardEquivalent = GamepadKeyToKeyboardKey[buttonIndex];

			this.#onKeyInternal(keyboardEquivalent, isPressed);
		}
	}

	// eslint-disable-next-line complexity
	static async rumble(force=1, duration=50) {
		// Ignore if no Gamepad is connected
		if (!this.#connectedGamepadId) return;

		// Search for the connected Gamepad
		const gamepad = navigator.getGamepads().find(x => x && x.id == this.#connectedGamepadId);
		if (!gamepad) return;

		// Get available actuators
		let actuators = [];
		if (gamepad.vibrationActuator) actuators = [gamepad.vibrationActuator];
		else if (gamepad.hapticActuators) actuators = gamepad.hapticActuators.filter(x => x);

		// For each available actuator, pulse or play effect
		for (const actuator of actuators) {
			if (actuator.pulse) {
				await actuator.pulse(force, duration);
			} else if (actuator.playEffect) {
				await actuator.playEffect(
					actuator.type || "dual-rumble",
					{
						startDelay: 0,
						duration: duration,
						weakMagnitude: force / 2,
						strongMagnitude: force,
					}
				);
			}
		}
	}

	/**
	 *
	 * @param  {Array<{ force: number, duration: number, delay: number }>} states
	 */
	static async rumbleSequence(states) {
		// Ignore if no Gamepad is connected
		if (!this.#connectedGamepadId) return;

		const delay = function (amount) {
			return new Promise((resolve, _) => {
				setTimeout(resolve, amount);
			});
		};

		for (const s of states) {
			await delay(s.delay);
			this.rumble(s.force, s.duration);
			await delay(s.duration);
		}
	}

	static #onKey(event) {
		this.#onKeyInternal(event.code, event.type === "keydown");
	}

	// eslint-disable-next-line max-statements
	static #onKeyInternal(key, isPressed) {
		// Verify if the event of this key is buffered
		// This is important to only handle an event once
		// Ignoring duplicates, which would be a problem in Menu or GameOver screens
		// If the user kept a key pressed the screen would simply skip itself
		const cached = this.#eventBuffer.find((x) => x.key === key);
		if (cached) {
			// If the buffered event is the same type of the new event, ignore it
			if (cached.isPressed === isPressed) return;

			// Change the buffered event type and continue
			cached.isPressed = isPressed;

			if (cached.isPressed) {
				cached.start = performance.now();
				delete cached.end;
			} else {
				cached.end = performance.now();

				// Check for one shot button trigger
				const timePressed = cached.end - cached.start;
				if (timePressed <= ONESHOT_BUTTON_TRIGGER_THRESHOLD) this.#oneShotEventBuffer.push(key);
			}
		} else {
			// The event wasn't buffered before, add it to the event buffer
			this.#eventBuffer.push({ key, isPressed, start: performance.now() });
		}

		// Ignore undefined keys
		const keyCodeIndex = this.#consumedKeyCodes.indexOf(key);
		if (keyCodeIndex === -1) return;

		const pressedKeysIndex = this.#pressedKeys.indexOf(key);

		if (!isPressed) {// Handles key up events
			// If on the pressed keys list, remove it
			if (pressedKeysIndex !== -1) this.#pressedKeys.splice(pressedKeysIndex, 1);
		} else if (pressedKeysIndex === -1) {// Handles key down event
			this.#pressedKeys.push(key);
		}
	}

	static isKeyDown(key) {
		return this.#pressedKeys.indexOf(key) !== -1;
	}

	/**
	 * Checks wether a key press was in range of 50ms, meaning a really fast button trigger
	 *
	 * @param {Key} key The key to check
	 * @return {boolean} True when the key was oneshot triggered
	 */
	static isKeyDownOneshot(key) {
		return this.#oneShotEventBuffer.includes(key);
	}

	static isAnyKeyDown() {
		return this.#pressedKeys.length > 0;
	}

	static resetKey(key) {
		const index = this.#pressedKeys.indexOf(key);
		if (index !== -1) this.#pressedKeys.splice(index, 1);
	}

	static resetAllKeys() {
		this.#oneShotEventBuffer = [];
		this.#pressedKeys = [];
	}

}

InputUtils.attachListeners();