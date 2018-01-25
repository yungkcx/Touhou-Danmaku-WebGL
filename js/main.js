'use strict';

const FMX = 500; // FIELD_MAX_X
const FMY = 583; // FIELD_MAX_Y
// const FMX = 384;
// const FMY = 448;
// Aliases.
let Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Texture = PIXI.Texture,
    Text = PIXI.Text,
    resources = PIXI.loader.resources,
    Rectangle = PIXI.Rectangle,
    Sprite = PIXI.Sprite;
let cos = Math.cos,
    sin = Math.sin,
    atan2 = Math.atan2,
    PI = Math.PI,
    PI2 = Math.PI * 2;
let editor;

window.onload = () => {
    let game = new Game(document.getElementById("game"), FMX, FMY);
    game.init().done(() => {
        editor.setValue(
            "function f(s) {\n" +
            "\tif (s.count == 0) {\n" +
            "\t\tlet b = get_bullet(s, 0, 0);\n" +
            "\t\tif (b == null) {\n" +
            "\t\t\treturn;\n" +
            "\t\t}\n" +
            "\t\tb.speed = 3;\n" +
            "\t\tb.angle = bossatan();\n" +
            "\t\tb.x = boss.x;\n" +
            "\t\tb.y = boss.y;\n" +
            "\t}\n" +
            "}"
        );
        addButtonListener(game);
    });
}

function addButtonListener(game) {
    let gameDiv = document.getElementById("game");
    gameDiv.onkeydown = handlekey("down");
    gameDiv.onkeyup = handlekey("up");

    document.getElementById("start").onclick = () => {
        let str = editor.getLine(0);
        let danmakuTitle = str[0] === '"' ? str : "";
        let danmakuFunc = editor.getRange({
            line: danmakuTitle === "" ? 0 : 1,
            ch: 0
        }, {
            line: editor.lineCount(),
            ch: 0
        });
        // let story_str;
        // if (selected_danmaku < 0) {
        //     story_str = "story=[add_danmaku(60,shot_bullet.length-1,0,0)];";
        // } else {
        //     story_str = "story=[add_danmaku(60,selected_danmaku,0,0)];";
        // }
        // str = "shot_bullet[shot_bullet.length-1]=create_danmaku(" +
        //     danmaku_title + (danmaku_title === "" ? "" : ",") +
        //     danmaku_func + ");" + story_str;
        // eval(str);
        game.start();
    };
    document.getElementById("stop").onclick = () => {
        game.stop();
    }
    document.getElementById("pause").onclick = () => {
        game.pause();
    };
    document.getElementById("continue").onclick = () => {
        game.continue();
    };

    let select = document.getElementById("select-danmaku");
    let option = document.createElement("option");
    option.value = -1;
    option.innerHTML = "From editor...";
    select.appendChild(option);
    // for (let i = 0; i < shot_bullet.length - 1; i++) {
    //     let option = document.createElement("option");
    //     option.value = i;
    //     if (shot_bullet[i].title != null) {
    //         option.innerHTML = shot_bullet[i].title;
    //     } else {
    //         option.innerHTML = i;
    //     }
    //     select.appendChild(option);
    // }
    // select.onchange = () => {
    //     selected_danmaku = select.value;
    // }
}

class Game {
    constructor(parent, width, height) {
        this.stage = new Container();
        this.renderer = autoDetectRenderer(width, height);
        this.mainLoopId = 0;
        this.player = new Player();
        this.boss = new Boss();
        this.danmaku = new Danmaku();
        this.width = width;
        this.height = height;
        this.count = 0;
        this.lastCount = 0; // For calculating fps.
        this.lastTime = 0;
        this.fpsText = new Text("00.00 fps", {
            font: "12px monospace",
            fill: "red"
        });
        this.fpsText.position.set(FMX - this.fpsText.width - 10, FMY - this.fpsText.height - 5);
        let self = this;
        parent.appendChild(this.renderer.view);
        this.stage.addChild(this.boss);
        this.stage.addChild(this.player);
        this.stage.addChild(this.danmaku);
        this.stage.addChild(this.fpsText);
        this.render();
    }

    render() {
        this.renderer.render(this.stage);
    }

    init() {
        let donefunc = null;
        loader
            .add(["data/img/bullet/bullet.json"])
            .load(() => {
                this.danmaku.createTextures("data/img/bullet/bullet.json");
                donefunc();
            });

        return {
            done: f => {
                donefunc = donefunc || f;
            }
        }
    }

    start() {
        this.stop();
        this.requestNextMainLoop();
    }

    stop() {
        if (this.mainLoopId !== 0) {
            window.cancelAnimationFrame(this.mainLoopId);
        }
        this.player.reset();
        this.boss.reset();
        this.danmaku.reset();
        this.mainLoopId = 0;
        this.count = 0;
        this.render();
    }

    pause() {
        if (this.mainLoopId !== 0) {
            window.cancelAnimationFrame(this.mainLoopId);
            this.mainLoopId = 0;
        }
    }

    continue () {
        if (this.mainLoopId === 0) {
            this.requestNextMainLoop();
        }
    }

    requestNextMainLoop() {
        this.mainLoopId = window.requestAnimationFrame(now => this.mainLoop(now));
    }

    calcAndDisplayFps(now) {
        if (now - this.lastTime >= 500) {
            let fps = (this.count - this.lastCount) / (now - this.lastTime) * 1000;
            this.lastCount = this.count;
            this.lastTime = now;
            let text = fps.toFixed(2) + " fps";
            this.fpsText.text = text;
        }
    }

    mainLoop(now) {
        this.player.update(this.count);
        this.boss.update(this.count);
        this.danmaku.update(this.count);
        this.render();
        this.calcAndDisplayFps(now);
        this.count++;
        this.requestNextMainLoop();
    }
};

class GameObject extends Sprite {
    constructor() {
        super();
        this.speed = 0;
        this.anchor.set(0.5, 0.5);
        this.angle = 0;
    }

    setAngle(angle) {
        this.angle = angle;
        this.rotation = angle + PI / 2;
    }

    setPos(x, y) {
        this.position.set(x, y);
    }

    move() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    }
}

class Player extends GameObject {
    constructor() {
        super();
        this.id = 0;
    }

    reset() {
        let x = FMX / 2;
        let y = FMY * 3 / 4;
        this.setPos(x, y);
    }

    update(count) {
        this.move();
    }
}

class Boss extends GameObject {
    constructor() {
        super();
        this.id = 0;
    }

    reset() {
        let x = FMX / 2;
        let y = FMY / 4;
        this.setPos(x, y);
    }

    update(count) {
        this.move();
    }
}

let sum = 0;

class Bullet extends GameObject {
    constructor() {
        super();
        this.count = 0;
        this.visible = false;
        this.state = 0;
    }

    update() {
        if (this.visible === true) {
            sum++;
            this.move();
            if (this.x < -50 || this.x > FMX + 50 || this.y < -50 || this.y > FMY + 50) {
                this.visible = false;
                sum--;
            }
            this.count++;
        }
    }
}

class Laser extends GameObject {
    constructor() {
        super();
        this.visible = false;
    }

    update() {
        if (this.visible === true) {}
    }
}

class Danmaku extends Container {
    constructor() {
        super();
        const MAX_BULLET = 10000;
        const MAX_LASER = 200;
        this.patternId = 0;
        this.textures = [];
        this.patterns = [];
        this.bullets = [];
        this.lasers = [];
        for (let i = 0; i < MAX_BULLET; i++) {
            let b = new Bullet();
            this.bullets.push(b);
            this.addChild(b);
        }
        for (let i = 0; i < MAX_LASER; i++) {
            this.lasers.push(new Laser());
        }
        this.patterns.push(t => {
            const NBULLET = 450;
            if (t % 10 === 0) {
                for (let i = 0; i < NBULLET; i++) {
                    let b = this.getBullet(5, 8);
                    if (b !== null) {
                        b.setPos(FMX / 2, FMY / 2);
                        b.setAngle(PI2 / NBULLET * i);
                        b.speed = 2;
                    }
                }
            }
        });
    }

    reset() {
        this.bullets.forEach(b => {
            b.visible = false;
        });
        this.lasers.forEach(la => {
            la.visible = false;
        });
    }

    getBullet(type, color) {
        if (type < 0 || this.textures.length <= type) {
            return null;
        }
        if (color < 0 || this.textures[type].length <= color) {
            return null;
        }
        for (let b of this.bullets) {
            if (b.visible === false) {
                b.visible = true;
                b.texture = this.textures[type][color];
                b.count = 0;
                return b;
            }
        }
        return null;
    }

    createTextures(url) {
        let id = resources[url].textures;
        this.textures = new Array(Object.getOwnPropertyNames(id).length);
        let bulletNums = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 3, 8, 5, 5, 8, 8, 8, 8, 8, 8, 4, 8, 8, 8, 8, 8, 3, 16, 8, 16, 16, 16, 10];
        let laserNum = 16;
        for (let i in id) {
            if (i === "laser.png") {
                continue;
            }
            let ts = [];
            let index = Number(i.substr(1, i.length - 4));
            let width = id[i].width / bulletNums[index];
            for (let j = 0; j < bulletNums[index]; j++) {
                let rect = new Rectangle(id[i].frame.x + width * j, id[i].frame.y, width, id[i].height);
                let texture = new Texture(id[i], rect);
                ts.push(texture);
            }
            this.textures[index] = ts;
        }
    }

    update(count) {
        sum = 0;
        this.patterns[this.patternId](count);
        this.bullets.forEach(b => {
            b.update();
        });
        this.lasers.forEach(la => {
            la.update();
        });
        if (count % 23 === 0) {
            document.getElementById("sum").children[0].innerHTML = sum;
        }
    }
}