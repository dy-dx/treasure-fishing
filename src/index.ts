import createGame from "./game";

const div = document.getElementById("main");
if (!div) {
  throw new Error("#main element is not present.");
}

const game = createGame(div, 720, 400);

if (module.hot) {
  module.hot.dispose(() => {
    game.destroy(true);
  });
}
