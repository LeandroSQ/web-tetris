import { Level } from "../model/level.js";

const background = [
	"#01BAEF", // I
	"#0466c8", // J
	"#f8961e", // L
	"#ffd166", // O
	"#2CDA9D", // S
	"#ef476f", // Z
	"#f15bb5", // T
];

const border = [
	"#0193bc", // I
	"#034c96", // J
	"#dc7c07", // L
	"#ffb300", // O
	"#1fb480", // S
	"#eb184a", // Z
	"#d41287", // T
];

const level = new Level({
	speed: 1,
	pieces: { background, border },
	page: {
		background: "#073B4C",
		foreground: "#ecf0f1",
	}
});

Level.list.push(level);