import { Tetrominoes, Tetromino } from "../model/tetromino";

export class RandomBag {

	/** @type {Tetromino[]} */
	static #bag = [];

	static push(tetromino) {
		this.#bag.push(tetromino);
	}

	static peek() {
		// Automatically resets the bag whenever it is empty
		if (this.#bag.length <= 0) this.reset();

		// Returns the last of the stack, without removing it
		return this.#bag[this.#bag.length - 1];
	}

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