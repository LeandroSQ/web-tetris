import { TetrominoType } from "../enum/tetromino-type";

export class Tetromino {

	constructor(shape, type) {
		this.shape = shape;
		this.type = type;
	}

}

export const Tetrominoes = [

	// I
	new Tetromino([
		[1, 1, 1, 1]
	], TetrominoType.I),

	// J
	new Tetromino([
		[1, 0, 0],
		[1, 1, 1]
	], TetrominoType.J),

	// L
	new Tetromino([
		[0, 0, 1],
		[1, 1, 1]
	], TetrominoType.L),

	// O
	new Tetromino([
		[1, 1],
		[1, 1]
	], TetrominoType.O),

	// S
	new Tetromino([
		[0, 1, 1],
		[1, 1, 0]
	], TetrominoType.S),

	// Z
	new Tetromino([
		[1, 1, 0],
		[0, 1, 1]
	], TetrominoType.Z),

	// T
	new Tetromino([
		[0, 1, 0],
		[1, 1, 1]
	], TetrominoType.T)

];