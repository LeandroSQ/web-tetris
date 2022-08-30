# web-tetris

<h1 align="center">Tetris</h1>

<p align="center">
  <img src=".github/images/screenshot02.png"/>
</p>

<p align="center">
    Tetris game made with JavaScript, HTML and CSS.
</p>

[Live demo](https://leandrosq.github.io/web-tetris/)

## How to play

### Keyboard

| Key | Icon| Description |
| -- | -- | -- |
| <kbd>Arrow up</kbd> | <img src=".github/images/Arrow_Up_Key_Dark.png" align="center" height="32"> | Rotate Clock-wise |
| <kbd>Arrow left</kbd> | <img src=".github/images/Arrow_Left_Key_Dark.png" align="center" height="32"> | Move left, if oneshot instantly moves. Allowing for hypertapping |
| <kbd>Arrow right</kbd> | <img src=".github/images/Arrow_Right_Key_Dark.png" align="center" height="32"> | Move right, if oneshot instantly moves. Allowing for hypertapping |
| <kbd>Arrow down</kbd> | <img src=".github/images/Arrow_Down_Key_Dark.png" align="center" height="32"> | Accelerates vertical fall |
| <kbd>Enter</kbd> | <img src=".github/images/Enter_Key_Dark.png" align="center" height="32"> | Rotate Anti-Cock-wise |
| <kbd>Space</kbd> | <img src=".github/images/Space_Key_Dark.png" align="center" height="32"> | Hard drop |
| <kbd>Esc</kbd> | <img src=".github/images/Esc_Key_Dark.png" align="center" height="32"> | Pause game |
| <kbd>Shift</kbd> | <img src=".github/images/Shift_Key_Dark.png" align="center" height="32"> | Faster horizontal movement when pressed alongside <kbd>Arrow Left</kbd> or <kbd>Arrow Right</kbd> |
| <kbd>M</kbd> | <img src=".github/images/M_Key_Dark.png" align="center" height="32">| Hold current piece |

### Game pad

<small>The game supports any GamePad, being Wireless, wired, Xbox, Generic or PS-X.</small>

| Button | Icon | Description |
| -- | -- | -- |
| <kbd>A</kbd> | <img src=".github/images/GamePad_A.png" align="center" height="24"> | Rotate Clock-wise |
| <kbd>X</kbd> | <img src=".github/images/GamePad_X.png" align="center" height="24"> | Rotate Anti-Cock-wise |
| <kbd>B</kbd> | <img src=".github/images/GamePad_B.png" align="center" height="24"> | Hard drop |
| <kbd>Y</kbd> | <img src=".github/images/GamePad_Y.png" align="center" height="24"> | Hold current piece |
| <kbd>Left Pad</kbd> | <img src=".github/images/GamePad_Dpad_Left.png" align="center" height="24"> | Move left, if oneshot instantly moves. Allowing for hypertapping |
| <kbd>Right Pad</kbd> | <img src=".github/images/GamePad_Dpad_Right.png" align="center" height="24"> | Move right, if oneshot instantly moves. Allowing for hypertapping |
| <kbd>Down Pad</kbd> | <img src=".github/images/GamePad_Dpad_Down.png" align="center" height="24"> | Accelerates vertical fall |
| <kbd>Menu</kbd> | <img src=".github/images/GamePad_Menu.png" align="center" height="24"> | Pause game |
| <kbd>LT or RT</kbd> | <img src=".github/images/GamePad_RT.png" align="center" height="24"> <img src=".github/images/GamePad_LT.png" align="center" height="24"> | Faster horizontal movement when pressed alongside <kbd>Left Pad</kbd> or <kbd>Right Pad</kbd> |

---

## Features

- GamePad API
- WebAudio API
  - Pitch manipulation
  - Looping sounds
  - Audio decoding from array buffer
- Localization
  - Available in:
    - Português - Brasil
	- English
- Fetch API
- Double buffering canvas
- HighDPI (Retina compatible) canvas
- Modern JavaScript (ES2021)
  - Modules
  - Classes
  - Private fields
- Follows Official Tetris Guidelines
- Animations
- Particle system
- Level system
- State machine
- Start menu, Pause and Game over screens

## Levels

In my version of tetris, not only colors and speed are modified when a new level is reached, the shape of the board is also affected. This introduces a new dimension where not only you need muscle memory, speed and dexterity to play, but you will also need to adapt and pay attention visually to these changes.
This in my opinion turns the game much more fun for those, like myself, that aren't Tetris masters and cannot go in impossible speeds, this adds the adaptability challenge by inviting your vision and brain to change.

### Level 1
	- Flat colors
	- Squircle

### Level 2
	- Flat colors
	- Square

### Level 3
	- Dracula colors
	- Squircle outline

### Level 4
	- Monokai colors
	- Circle
	
### Level 5
	- Material colors
	- Hexagon

## Changelog

### v2.0.0

- Complete overhaul and refactor of the game
- Added UI elements inside the canvas
- Better fixed game loop
- Added hard drop system
- Added holding piece system
- Added peeking the Random bag
- Better visuals
- Added better responsiveness, for future mobile support
- Added support for the GamePad API
- Added Localization
- Added shape shifting logic for each level

<p align="center">
  <img src=".github/images/screenshot02.png"/>
</p>

### v1.0.0

<p align="center">
  <img src=".github/images/screenshot01.png"/>
</p>

## TODO

[] - Add more levels

[] - Mobile support

[] - Settings menu

[] - In-game controls information


## Acknowledgements

[ThoseAwesomeGuys Prompts](https://thoseawesomeguys.com/prompts) for the Keyboard and GamePad icons.

[Zeh Jose Fernando Baldo Carneiro](https://www.dafont.com/nokia-cellphone.font) for the Font (NokiaFC22) used on this game.
