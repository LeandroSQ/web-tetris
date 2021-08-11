import { Tetrominoes } from "../model/tetromino.js";

export class RandomBag {

	static #bag = [];

	static pop() {
		// Automatically resets the bag whenever it is empty
		if (this.#bag.length <= 0) this.reset();

		// Remove the last of the stack
		return this.#bag.pop();
	}

	static reset() {
		this.#bag = Tetrominoes.slice(0).shuffle();
	}

}