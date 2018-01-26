'use strict';

const FMX = 500; // FIELD_MAX_X
const FMY = 583; // FIELD_MAX_Y
// const FMX = 384;
// const FMY = 448;
// Aliases.
let Container = PIXI.Container,
    AnimatedSprite = PIXI.extras.AnimatedSprite,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    Texture = PIXI.Texture,
    TextureCache = PIXI.utils.TextureCache,
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
    gameDiv.onkeydown = game.input.handle("down");
    gameDiv.onkeyup = game.input.handle("up");

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
        gameDiv.focus();
        game.start();
    };
    document.getElementById("stop").onclick = () => {
        game.stop();
    }
    document.getElementById("pause").onclick = () => {
        game.pause();
    };
    document.getElementById("continue").onclick = () => {
        gameDiv.focus();
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

class KeyInput {
    constructor() {
        KeyInput.SHOT = 0;
        KeyInput.LEFT = 1;
        KeyInput.UP = 2;
        KeyInput.RIGHT = 3;
        KeyInput.DOWN = 4;
        KeyInput.SLOW = 5;
        this.states = [false, false, false, false, false]
    }

    handle(type) {
        let bool = type === "down" ? true : false;
        return event => {
            switch (event.keyCode) {
                case 90: // Z
                    this.states[KeyInput.SHOT] = bool;
                    break;
                case 37: // LEFT
                    this.states[KeyInput.LEFT] = bool;
                    break;
                case 38: // UP
                    this.states[KeyInput.UP] = bool;
                    break;
                case 39: // RIGHT
                    this.states[KeyInput.RIGHT] = bool;
                    break;
                case 40: // DOWN
                    this.states[KeyInput.DOWN] = bool;
                    break;
                case 16: // SHIFT
                    this.states[KeyInput.SLOW] = bool;
                    break;
                default:
                    break;
            }
        }
    }

    isPressed(key) {
        if (0 <= key && key < this.states.length) {
            return this.states[key];
        }
        return false;
    }
}

class Game {
    constructor(parent, width, height) {
        this.stage = new Container();
        this.renderer = autoDetectRenderer(width, height);
        this.input = new KeyInput();
        this.mainLoopId = 0;
        this.player = new Player(this.input);
        this.boss = new Boss();
        this.danmaku = new Danmaku(this.boss, this.player.position);
        this.width = width;
        this.height = height;
        this.count = 0;
        this.lastCount = 0; // For calculating fps.
        this.lastTime = 0;
        this.fpsText = new Text("00.00 fps", {
            font: "12px monospace",
            fill: "white"
        });
        this.fpsText.position.set(FMX - this.fpsText.width - 10, FMY - this.fpsText.height - 5);

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
            .add(["data/img/bullet/bullet.json", "data/img/player/pl0.png", "data/img/boss/boss4.png"])
            .load(() => {
                this.danmaku.createTextures("data/img/bullet/bullet.json");
                this.danmaku.set(0);
                this.player.set(0);
                this.boss.set(4);
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
        this.player.visible = true;
        this.player.playAnimation(this.player.states.normal);
        this.boss.visible = true;
        this.boss.putPhysic(FMX / 2, FMY / 4, 50);
        this.boss.playAnimation();
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
        this.visible = false;
        this.speed = 0;
        this.anchor.set(0.5, 0.5);
        this.anglev = 0;
    }

    get angle() {
        return this.anglev;
    }

    set angle(value) {
        this.anglev = value;
        this.rotation = value + PI / 2;
    }

    setPos(x, y) {
        this.position.set(x, y);
    }

    atan2xy(x, y) {
        return atan2(y - this.y, x - this.x);
    }

    move() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    }
}

class Player extends GameObject {
    constructor(input) {
        super();
        this.id = 0;
        this.speed = 5;
        this.input = input;
        this.char = []; // Store character animations.
        this.animation = null;
        this.moveCount = 0;
        this.states = {
            normal: 0,
            turnLeft: 1,
            left: 2,
            turnRight: 3,
            right: 4
        };
        Player.chars = [];
    }

    reset() {
        this.setPos(FMX / 2, FMY * 3 / 4);
        if (this.animation !== null) {
            this.animation.gotoAndStop(0);
        }
        this.visible = false;
    }

    set(id) {
        if (Player.chars[id] === undefined) {
            let animes = [];
            let url = "data/img/player/pl" + id + ".png";
            if (TextureCache[url] === undefined) {
                console.error("Error: Invalid player id");
                return;
            }
            animes[0] = GameUtil.createAnimation(url, 8, 0, 0, 32, 48);
            animes[1] = GameUtil.createAnimation(url, 4, 0, 48, 32, 48);
            animes[2] = GameUtil.createAnimation(url, 4, 128, 48, 32, 48);
            animes[3] = GameUtil.createAnimation(url, 4, 0, 96, 32, 48);
            animes[4] = GameUtil.createAnimation(url, 4, 128, 96, 32, 48);
            for (let i = 0; i < animes.length; i++) {
                if (i === 1 || i === 3) {
                    animes[i].animationSpeed = 1;
                    animes[i].onComplete = () => this.playAnimation(this.states.normal + i + 1);
                    animes[i].loop = false;
                } else {
                    animes[i].animationSpeed = 1 / 6;
                }
                this.addChild(animes[i]);
            }
            Player.chars[id] = animes;
        }
        this.char = Player.chars[id];
    }

    playAnimation(state) {
        if (this.animation !== null) {
            this.animation.stop();
            this.animation.visible = false;
        }
        if (this.char.length !== null) {
            this.animation = this.char[state];
            this.animation.visible = true;
            this.animation.gotoAndPlay(0);
        }
    }

    updateState() {
        let state;
        if (this.input.isPressed(KeyInput.LEFT)) {
            if (this.animation !== this.char[this.states.left] &&
                this.animation !== this.char[this.states.turnLeft]) {
                state = this.states.turnLeft;
            }
        } else if (this.input.isPressed(KeyInput.RIGHT)) {
            if (this.animation !== this.char[this.states.right] &&
                this.animation !== this.char[this.states.turnRight]) {
                state = this.states.turnRight;
            }
        } else {
            this.moveCount = 0;
            state = this.states.normal;
        }
        if (state !== undefined && this.animation !== this.char[state]) {
            this.playAnimation(state);
        }
    }

    move() {
        let speedX = [-this.speed, this.speed, 0, 0],
            speedY = [0, 0, -this.speed, this.speed];
        let input = [
            this.input.isPressed(KeyInput.LEFT),
            this.input.isPressed(KeyInput.RIGHT),
            this.input.isPressed(KeyInput.UP),
            this.input.isPressed(KeyInput.DOWN)
        ];
        input[1] = input[0] === true ? false : input[1];
        input[3] = input[2] === true ? false : input[3];
        let horizontal = false,
            vertical = false;
        let coef = 1;

        if ((input[0] === true || input[1] === true) &&
            (input[2] === true || input[3] === true)) {
            coef = Math.SQRT2;
        }
        for (let i = 0; i < input.length; i++) {
            if (input[i] === true) {
                let x = this.x,
                    y = this.y;
                let sx = speedX[i],
                    sy = speedY[i];
                if (this.input.isPressed(KeyInput.SLOW)) {
                    sx /= 3;
                    sy /= 3;
                }
                x += sx / coef, y += sy / coef;
                if (!(x < 10 || FMX - 10 < x || y < 5 || FMY - 5 < y)) {
                    this.setPos(x, y);
                }
            }
        }
    }

    update(count) {
        this.updateState();
        this.move();
    }
}

class Boss extends GameObject {
    constructor() {
        super();
        this.id = 0;
        this.physic = {
            on: false,
            count: 0,
            ax: 0,
            v0x: 0,
            ay: 0,
            v0y: 0,
            vx: 0,
            vy: 0,
            prex: 0,
            prey: 0
        };
        this.animation = null;
        Boss.chars = [];
    }

    reset() {
        this.setPos(FMX / 2, -50);
        if (this.animation !== null) {
            this.animation.gotoAndStop(0);
        }
        this.visible = false;
    }

    set(id) {
        if (Boss.chars[id] === undefined) {
            // Load the image and create animation.
            let url = "data/img/boss/boss" + id + ".png";
            if (TextureCache[url] === undefined) {
                console.error("Error: Invalid Boss id");
                return;
            }
            let anime = GameUtil.createAnimation(url, 4, 0, 0, 64, 64);
            anime.animationSpeed = 1 / 6;
            this.addChild(anime);
            Boss.chars[id] = anime;
        }
        this.animation = Boss.chars[id];
    }

    playAnimation() {
        if (this.animation !== null) {
            this.animation.stop();
            this.animation.visible = false;
        }
        this.animation.visible = true;
        this.animation.gotoAndPlay(0);
    }

    calcPhysic() {
        let phy = this.physic;
        let t = phy.count;
        this.x = phy.prex - ((phy.v0x * t) - 0.5 * phy.ax * t * t);
        this.y = phy.prey - ((phy.v0y * t) - 0.5 * phy.ay * t * t);
        phy.count++;
        if (phy.count >= phy.time) {
            phy.on = false;
        }
    }

    // For accelaration.
    putPhysic(x, y, t) {
        let phy = this.physic;
        let maxX, maxY;
        if (t === 0) {
            t = 1;
        }
        phy.on = true;
        phy.count = 0;
        phy.time = t;
        maxX = this.x - x;
        phy.v0x = 2 * maxX / t;
        phy.ax = 2 * maxX / (t * t);
        phy.prex = this.x;
        maxY = this.y - y;
        phy.v0y = 2 * maxY / t;
        phy.ay = 2 * maxY / (t * t);
        phy.prey = this.y;
    }

    update(count) {
        if (this.physic.on === true) {
            this.calcPhysic();
        }
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
    constructor(boss, playerPosition) {
        super();
        const MAX_BULLET = 10000;
        const MAX_LASER = 200;
        this.boss = boss;
        this.plpos = playerPosition;
        this.textures = [];
        this.pattern = null;
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
            const NBULLET = 500;
            if (t % 10 === 0) {
                for (let i = 0; i < NBULLET; i++) {
                    let b = this.getBullet(5, 8);
                    if (b !== null) {
                        b.setPos(FMX / 2, FMY / 2);
                        b.angle = PI2 / NBULLET * i;
                        b.speed = 2;
                    }
                }
            }
        });
    }

    set(id) {
        this.pattern = this.patterns[id];
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
            console.error("Error: Invalid bullet type");
            return null;
        }
        if (color < 0 || this.textures[type].length <= color) {
            console.error("Error: Invalid bullet color");
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

    // Return the angle between the bullet and the player.
    atan2pl(bullet) {
        return bullet.atan2xy(this.plpos.y, this.plpos.x);
    }

    // Return the angle between the boss and player.
    bossatan2pl() {
        return this.boss.atan2xy(this.plpos.y, this.plpos.x);
    }

    setPatterns(patterns) {
        this.patterns = patterns;
    }

    update(count) {
        sum = 0;
        this.pattern(count);
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

    static createPattern(title_or_func, shot_func) {
        let obj = {
            title: title_or_func,
            shot: shot_func
        };
        if (arguments.length === 1 && typeof title_or_func === "function") {
            obj.title = null;
            obj.shot = title_or_func;
            return obj;
        } else if (arguments.length === 2 && typeof title_or_func === "string") {
            return obj;
        } else {
            console.error("Error: Invalid type of the arguments");
            return null;
        }
    }
}

class GameUtil {
    static createAnimation(textureId, n, startX, startY, width, height) {
        let base = TextureCache[textureId];
        let textures = Array.from(new Array(n), (v, i) => i).map(x => {
            return x * width + startX;
        }).map(x => {
            let texture = new Texture(base);
            texture.frame = new Rectangle(x, startY, width, height);
            return texture;
        });
        let anime = new AnimatedSprite(textures);
        anime.visible = false;
        anime.anchor.set(0.5, 0.5);
        return anime;
    }

    static rangeAngle(angle) {
        return (-angle + angle * 2 * Math.random());
    }

    static randInt(max) {
        return Math.floor(Math.random() * max);
    }

    static randArray(n, layer = 1) {
        let arr = [];
        let retarr = [];
        let layerlen = Math.ceil(n / layer);
        for (let j = 0; j < layer; j++) {
            let tmparr = [];
            let tmplen;
            if (n - arr.length < layerlen) {
                tmplen = n - arr.length;
            } else {
                tmplen = Math.ceil(n / layer);
            }
            for (let i = 0; i < tmplen; i++) {
                tmparr.push(j + layer * i);
            }
            for (let i = tmplen - 1; i > 0; i--) {
                let t = Math.floor(Math.random() * (i + 1));
                let item = tmparr[t];
                tmparr[t] = tmparr[i];
                tmparr[i] = item;
            }
            arr.push(tmparr);
        }
        for (let i = arr.length - 1; i > 0; i--) {
            let t = Math.floor(Math.random() * (i + 1));
            let item = arr[t];
            arr[t] = arr[i];
            arr[i] = item;
        }
        arr.forEach(a => {
            retarr = retarr.concat(a);
        });
        return retarr;
    }
}