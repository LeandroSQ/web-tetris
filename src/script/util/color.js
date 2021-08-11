import { Level } from "../model/level.js";

export class ColorUtils {

	static getColor(index=0, level=0) {
		return Level.list[level].getColorForPiece(index);
	}

}