// Get the window.location path
// In order to work on github pages, since the html files aren't at the root directory
const audioSourcePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));

export const SoundEffect = {
	"PLACE_BLOCK": `${audioSourcePath}/audio/place.mp3`,
	"GAME_OVER": `${audioSourcePath}/audio/gameover.wav`,
	"THEME": `${audioSourcePath}/audio/music.mp3`,
	"SCORE": `${audioSourcePath}/audio/score.wav`,
};