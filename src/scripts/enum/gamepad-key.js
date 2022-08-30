import { Key } from "./key";

export const GamepadKey = {
	"A": 0,
	"B": 1,
	"X": 2,
	"Y": 3,

	"UP_PAD": 12,
	"DOWN_PAD": 13,
	"LEFT_PAD": 14,
	"RIGHT_PAD": 15,

	"LEFT_TRIGGER": 6,
	"RIGHT_TRIGGER": 7,

	"MENU": 9
};


export const GamepadKeyToKeyboardKey = {
	[GamepadKey.A]: Key.ARROW_UP,/* Rotate */
	[GamepadKey.DOWN_PAD]: Key.ARROW_DOWN, /* Down */
	[GamepadKey.LEFT_PAD]: Key.ARROW_LEFT, /* Left */
	[GamepadKey.RIGHT_PAD]: Key.ARROW_RIGHT, /* Right */
	[GamepadKey.B]: Key.SPACE,/* Hard drop */
	[GamepadKey.X]: Key.ENTER,/* Rotate */
	[GamepadKey.MENU]: Key.ESCAPE,/* Pause */
	[GamepadKey.LEFT_TRIGGER]: Key.SHIFT,/* Speed multiply */
	[GamepadKey.RIGHT_TRIGGER]: Key.SHIFT,/* Speed multiply */
	[GamepadKey.Y]: Key.CONTROL
};