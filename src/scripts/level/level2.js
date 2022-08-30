import { Level } from "../model/level";

const background = [
	"#8be9fd", // I
	"#6272a4", // J
	"#ffb86c", // L
	"#f1fa8c", // O
	"#50fa7b", // S
	"#ff5555", // Z
	"#ff79c6", // T
];

const border = [
	"#59e0fc", // I
	"#4d5b86", // J
	"#ff9f39", // L
	"#ebf85b", // O
	"#1ef956", // S
	"#ff2222", // Z
	"#ff46b0", // T
];

const level = new Level({
	speed: 2.5,
	shape: "rect",
	fillShape: false,
	pieces: { background, border },
	page: {
		background: "#282a36",
		foreground: "#f8f8f2",
	},
});

Level.list.push(level);