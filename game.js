import kaboom, { big } from "./kaboom.js";

kaboom({
  background: [144, 149, 202],
});

loadRoot("./sprites/");

loadSprite("mario", "mario.png");
loadSprite("mario_down", "mario_down.png");
loadSprite("coin", "coin.png");
loadSprite("cloud", "cloud.png");
loadSprite("castle", "castle.png");
loadSprite("OG_Block", "OG_block.png");
loadSprite("block", "block.png");
loadSprite("normal_block", "block_new.png");
loadSprite("blue_block", "block_blue.png");
loadSprite("dino", "dino.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("loop", "loop.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("pipe2", "pipe2.png");
loadSprite("pipe3", "pipe3.png");
loadSprite("pipe4", "pipe4.png");
loadSprite("princes", "princes.png");
loadSprite("spongebob", "spongebob.png");
loadSprite("star", "star.png");
loadSprite("surprise", "surprise.png");
loadSprite("unboxed", "unboxed.png");

loadSound("jumpSound", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");

scene("win", () => {});

scene("lose", () => {
  add([
    text("You Died \n Press r to start", { size: 24 }),
    pos(center()),
    origin("center"),
    color(255, 255, 255),
  ]);

  onKeyRelease("r", () => {
    go("main_lvl");
  });
});

scene("main_lvl", () => {
  layers(["bg", "obj", "ui"], "obj");

  play("gameSound");

  const map = [
    "                                                                                                                  ",
    "                                                                                                                  ",
    "                                                                                                                  ",
    "             ?                                                     / /                                            ",
    "                                                                   %%%%%%%%    %%%?              &                ",
    "                                                                                                                  ",
    "                                                                                                                  ",
    "     ?     %&%?%                                                                  %     %%    ?  ?  ?             ",
    "                                    *       *                    %&%                                              ",
    "                              *     {       {                                                                     ",
    "                    *         {     {       {                                                                     ",
    "=                  /                                                                                              ",
    "========================================================  ===============   ======================================",
    "========================================================  ===============   ======================================",
    "========================================================  ===============   ======================================",
    "========================================================  ===============   ======================================",
    "========================================================  ===============   ======================================",
  ];

  const MapKeys = {
    width: 20,
    height: 20,
    "=": () => [sprite("OG_Block"), solid(), area()],
    "%": () => [sprite("block"), solid(), area()],
    $: () => [sprite("coin"), area(), "coin"],
    m: () => [sprite("mushroom"), body(), area(), "mushroom"],
    "?": () => [sprite("surprise"), solid(), area(), "surprise-coin"],
    x: () => [sprite("unboxed"), solid(), area()],
    "*": () => [sprite("pipe"), solid(), area(), "pipe"],
    "{": () => [sprite("pipe2"), solid(), area()],
    "}": () => [sprite("pipe3"), solid(), area()],
    "-": () => [sprite("pipe4"), solid(), area()],
    "/": () => [
      sprite("evil_mushroom"),
      body(),
      origin("bot"),
      area(),
      "evil_mushroom",
    ],
    "&": () => [sprite("surprise"), solid(), area(), "surprise-mushroom"],
  };

  const gameLevel = addLevel(map, MapKeys);

  const scoreLable = add([
    text("0"),
    pos(30, 0),
    layer("ui"),
    {
      value: "0",
    },
  ]);

  let isJumping = false;

  let player = add([
    sprite("mario"),
    pos(30, 0),
    body(),
    origin("bot"),
    area(),
    big(),
  ]);

  onKeyDown("right", () => {
    player.move(120, 0);
    player.flipX();
  });

  onKeyDown("left", () => {
    player.flipX(-1);
    player.move(-120, 0);
  });

  onKeyPress("space", () => {
    if (player.isGrounded()) {
      play("jumpSound");
      player.jump(600);
      isJumping = true;
    }
  });

  onKeyDown("down", (event) => {
    player.use(sprite("mario_down"));
  });

  player.onHeadbutt((obj) => {
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }

    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("m", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("x", obj.gridPos);
    }
  });

  player.onUpdate(() => {
    camPos(player.pos.x + 400, player.pos.y);
    onKeyDown("down", (event) => {
      player.use(sprite("mario_down"));
    });
    onKeyDown("up", (event) => {
      player.use(sprite("mario"));
    });
  });

  player.onCollide("coin", (coin) => {
    destroy(coin);
  });

  player.onCollide("mushroom", (mushroom) => {
    destroy(mushroom);
    player.biggify(0);
  });

  player.onCollide("pipe", () => {
    onKeyPress("down"), () => go("");
  });

  onUpdate("mushroom", (mushroom) => {
    mushroom.move(40, 0);
  });

  onUpdate("evil_mushroom", (evil_mushroom) => {
    evil_mushroom.move(-40, 0);
  });

  player.onCollide("evil_mushroom", (evil_mushroom) => {
    if (isJumping) {
      destroy(evil_mushroom);
    } else if (player.isBig()) {
      player.smallify();
    } else {
      go("lose");
    }
  });

  player.onUpdate(() => {
    if (player.isGrounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
});

scene("underground_lvl", () => {
  layers(["bg", "obj", "ui"], "obj");
});

scene("start", () => {
  layers(["bg", "obj", "ui"], "obj");
  add([
    text("Press enter to start", { size: 24 }),
    pos(center()),
    origin("center"),
    color(255, 255, 255),
  ]);

  onKeyRelease("enter", () => {
    go("main_lvl");
  });
});

go("start");
