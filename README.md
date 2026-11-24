# Life of a Zebra 🦓

A small browser game built with plain HTML, CSS and JavaScript. You are a zebra trying to stay alive. Cross the screen before the time runs out, and don't let a lion catch you.

## How to play

1. Click **Start** on the introduction screen.
2. Use the arrow keys to move the zebra.
3. Run to the **right edge** of the screen to win.
4. Avoid the lions that run in from the right.
5. If a lion catches you, or the 25 seconds run out, click **Try again**.

### Controls

| Key | Action |
| --- | --- |
| ⬅️ | Move left and face back |
| ➡️ | Move right and face forward |
| ⬆️ | Move up |
| ⬇️ | Move down |

## Features

- **Three screens:** introduction, level one, and a final "What a day to be alive" screen.
- **Countdown timer:** 25 seconds to cross. It starts with your first move.
- **Score:** 1 point for every second you stay alive.
- **Best score and previous scores:** saved in the browser with `localStorage`, so they stay after a refresh.
- **Random lions:** they appear from the right at random heights and speeds, and only after the zebra starts moving.
- **Limited zebra movement:** the zebra can only move up and down inside the same band where the lions run.
- **Face-to-face collisions:** a hit only counts when the zebra and a lion are on the same line, overlap deeply, and the zebra is facing the lion.
- **Sounds:** a zebra sound when the run starts and a lion roar when you are caught.
- **Messages:** a message appears when a lion catches you or when time runs out.

## Project structure

```
project/
  index.html        the three screens and the sound tags
  styles.css        layout, backgrounds, text and buttons
  images/
    zebrasound.mp3  played when the zebra starts running
    lionsound.mp3   played when a lion catches the zebra
  js/
    lion.js         Lion class (runs from right to left)
    tree.js         Zebra class (the player)
    levelone.js     LevelOne class (the game logic)
    index.js        screen buttons: start, try again, play again
```

File names may differ in your copy. What matters is that `index.js` loads **last**, because it uses the classes from the other files.

```html
<script src="./js/lion.js"></script>
<script src="./js/tree.js"></script>
<script src="./js/levelone.js"></script>
<script src="./js/index.js"></script>
```

## How to run it

1. Download or copy the project folder.
2. Open `index.html` in a browser (double-click it, or use the Live Server extension in VS Code).
3. Press **Start**.

No installation is needed. Sound only plays after the player has clicked or pressed a key, which is a browser rule.

## How the code works

### `Zebra`
The player. It stores `x`, `y`, `width`, `height` and `facing` (1 = right, -1 = left), draws itself as a `div` with a GIF background, and moves with `updatePosition()`.

### `Lion`
An enemy. It starts at the right edge and moves left by its `speed` every frame. `isOffScreen()` tells the game when it can be removed.



If you change the area in one place, change it in the other so the lions can still reach the zebra.

## Credits
- Images Link here: 
1. Introudction screen background : https://i.pinimg.com/originals/69/8e/48/698e48f4d6b88b556bc6c96b62bfe2df.gif
2. Level one screen background: https://i.pinimg.com/originals/2f/10/ce/2f10ce69b96c0611989308b0abc68e70.gif
3. Zebra: https://i.pinimg.com/originals/f4/30/57/f4305767fe8cc6128a2628972b8f304c.gif
4. Lion: https://i.pinimg.com/originals/c1/0f/09/c10f09d7fe6f756c8abf441c92a0ba3c.gif
5. Final screen background: https://media.baamboozle.com/uploads/images/42374/1654225316_173978_gif-url.gif

- Fonts: [Bungee](https://fonts.google.com/specimen/Bungee) and [Fredoka](https://fonts.google.com/specimen/Fredoka) from Google Fonts.
- Sounds credit: https://elevenlabs.io/sound-effects/zebra 

Thank you!