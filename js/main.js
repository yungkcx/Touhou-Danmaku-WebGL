'use strict';

const FMX = 500; // Maximum field x
const FMY = 583; // Maximum field y
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
    BLEND_MODES = PIXI.BLEND_MODES,
    Sprite = PIXI.Sprite;
let cos = Math.cos,
    sin = Math.sin,
    atan2 = Math.atan2,
    PI = Math.PI,
    PI2 = Math.PI * 2;
let editor;

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

class GameObject extends Sprite {
    constructor() {
        super();
        this.visible = false;
        this.vx = 0;
        this.vy = 0;
        this.anchor.set(0.5, 0.5);
        this.anglev = 0;
        this.speedv = 0;
    }

    get angle() {
        return this.anglev;
    }
    set angle(value) {
        this.anglev = value;
        this.rotation = value + PI / 2;
        this.vx = this.speed * cos(value);
        this.vy = this.speed * sin(value);
    }

    get speed() {
        return this.speedv;
    }
    set speed(value) {
        this.speedv = value;
        this.vx = value * cos(this.angle);
        this.vy = value * sin(this.angle);
    }

    setPos(x, y) {
        this.position.set(x, y);
    }

    atan2xy(x, y) {
        return atan2(y - this.y, x - this.x);
    }

    atan2obj(obj) {
        return atan2(obj.y - this.y, obj.x - this.x);
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
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
        input[1] = input[0] ? false : input[1];
        input[3] = input[2] ? false : input[3];
        let horizontal = false,
            vertical = false;
        let coef = 1;

        if ((input[0] || input[1]) &&
            (input[2] || input[3])) {
            coef = Math.SQRT2;
        }
        for (let i = 0; i < input.length; i++) {
            if (input[i]) {
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

    randMove(x1, y1, x2, y2, dist, t) {
        for (let i = 0; i < 1000; i++) {
            let x = this.x,
                y = this.y;
            let angle = range(PI);
            x += cos(angle) * dist;
            y += sin(angle) * dist;
            if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
                this.putPhysic(x, y, t);
                return true;
            }
        }
        return false; // Failed.
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
        if (this.physic.on) {
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
        this.baseAngle = 0;
        this.typev = 0;
        this.colorv = 0;
        this.rotate = false;
    }

    get type() {
        return this.typev;
    }
    set type(value) {
        this.typev = value;
        this.texture = Bullet.textures[this.typev][this.colorv];
    }

    get color() {
        return this.colorv;
    }
    set color(value) {
        this.colorv = value;
        this.texture = Bullet.textures[this.typev][this.colorv];
    }

    set effect(value) {
        switch (value) {
            case 0:
                this.blendMode = BLEND_MODES.NORMAL;
                break;
            case 1:
                this.alpha = 255;
                this.blendMode = BLEND_MODES.ADD;
                break;
            default:
        }
    }

    update() {
        if (this.visible) {
            sum++;
            this.move();
            if (this.rotate) {
                this.rotation = PI2 * (this.count % 120) / 120;
            }
            if (this.x < -50 || this.x > FMX + 50 || this.y < -50 || this.y > FMY + 50) {
                this.visible = false;
                sum--;
            }
            this.count++;
        }
    }

    static setTextures(url) {
        let id = resources[url].textures;
        Bullet.textures = [];
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
            Bullet.textures[index] = ts;
        }
    }
}

class Laser extends GameObject {
    constructor() {
        super();
        this.visible = false;
    }

    update() {
        if (this.visible) {}
    }
}

class Danmaku extends Container {
    constructor() {
        Danmaku.patterns = [];
        Danmaku.layerData = [
            [25, 26, 33],
            [21],
            [12, 16, 20, 22],
            [15, 17, 18, 19, 23, 24, 29],
            [1, 2, 10, 13, 14],
            [0, 3, 4, 5, 6, 7, 8, 9, 11, 28],
            [30, 31, 32],
            [27],
        ];
        super();
        const MAX_BULLET = 6000;
        const MAX_LASER = 200;
        this.bulletLayers = [];
        this.pattern = null;
        this.bullets = [];
        this.lasers = [];
        for (let i = 0; i < Danmaku.layerData.length; i++) {
            let container = new Container();
            this.bulletLayers.push(container);
            this.addChild(container);
        }
        for (let i = 0; i < MAX_BULLET; i++) {
            let b = new Bullet();
            this.bullets.push(b);
        }
        for (let i = 0; i < MAX_LASER; i++) {
            this.lasers.push(new Laser());
        }
    }

    set(id) {
        this.pattern = Danmaku.patterns[id];
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
        if (type < 0 || Bullet.textures.length <= type) {
            console.error("Error: Invalid bullet type");
            return null;
        }
        if (color < 0 || Bullet.textures[type].length <= color) {
            console.error("Error: Invalid bullet color");
            return null;
        }
        for (let b of this.bullets) {
            if (b.visible === false) {
                b.visible = true;
                b.rotate = 0;
                b.effect = 0;
                b.type = type;
                b.color = color;
                b.count = 0;
                let index = Danmaku.inWhichLayer(type);
                b.setParent(this.bulletLayers[index]);
                return b;
            }
        }
        return null;
    }

    handleBullets(callbackfn) {
        this.bullets.filter(b => {
            return b.visible;
        }).forEach(b => {
            callbackfn(b);
        });
    }

    update(count) {
        if (count < 0) {
            count = NaN;
        }
        sum = 0;
        this.pattern.shot(count);
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

    static inWhichLayer(bulletType) {
        for (let i = 0; i < Danmaku.layerData.length; i++) {
            for (let t of Danmaku.layerData[i]) {
                if (t == bulletType) {
                    return i;
                }
            }
        }
        return 0;
    }

    static setPatterns(patterns) {
        Danmaku.patterns = patterns;
    }

    static createPattern(titleOrFunc, shotFunc) {
        let obj = {
            title: titleOrFunc,
            shot: shotFunc
        };
        if (arguments.length === 1 && typeof titleOrFunc === "function") {
            obj.title = null;
            obj.shot = titleOrFunc;
            return obj;
        } else if (arguments.length === 2 && typeof titleOrFunc === "string") {
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

class Game {
    constructor(width, height) {
        this.stage = new Container();
        this.renderer = autoDetectRenderer(width, height);
        this.input = new KeyInput();
        this.mainLoopId = 0;
        this.player = new Player(this.input);
        this.boss = new Boss();
        this.danmaku = new Danmaku();
        this.width = width;
        this.height = height;
        this.isPaused = false;
        this.count = 0;
        this.lastCount = 0; // For calculating fps.
        this.lastTime = 0;
        this.fpsText = new Text("00.00 fps", {
            font: "12px monospace",
            fill: "white"
        });
        this.fpsText.position.set(FMX - this.fpsText.width - 10, FMY - this.fpsText.height - 5);

        this.stage.addChild(this.boss);
        this.stage.addChild(this.player);
        this.stage.addChild(this.danmaku);
        this.stage.addChild(this.fpsText);
        this.render();
    }

    addTo(parent) {
        parent.appendChild(this.renderer.view);
    }

    render() {
        this.renderer.render(this.stage);
    }

    init() {
        let donefunc = null;
        loader
            .add(["data/img/bullet/bullet.json", "data/img/player/pl0.png", "data/img/boss/boss4.png"])
            .load(() => {
                Bullet.setTextures("data/img/bullet/bullet.json");
                this.setPlayer(0);
                this.setBoss(4);
                donefunc();
            });

        return {
            done: f => {
                donefunc = donefunc || f;
            }
        }
    }

    setDanmaku(id) {
        this.danmaku.set(id);
    }

    setPlayer(id) {
        this.player.set(id);
    }

    setBoss(id) {
        this.boss.set(id);
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
        this.count = 0;
        this.isPaused = false;
        this.fpsText.text = "00.00 fps";
        this.render();
    }

    pause() {
        if (!this.isPaused) {
            window.cancelAnimationFrame(this.mainLoopId);
            this.isPaused = true;
        }
    }

    continue () {
        if (this.isPaused) {
            this.requestNextMainLoop();
            this.isPaused = false;
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
        this.danmaku.update(this.count - 50); // -50 for the boss to come on the stage.
        this.render();
        this.calcAndDisplayFps(now);
        this.count++;
        this.requestNextMainLoop();
    }
};

let game = new Game(FMX, FMY);
window.onload = () => {
    Danmaku.setPatterns(danmakuPatterns);
    game.addTo(document.getElementById("game"));
    game.init().done(() => {
        editor.setValue(
            // "function f(t) {\n" +
            "if (t == 0) {\n" +
            "\tlet b = getBullet(0, 0);\n" +
            "\tif (b != null) {\n" +
            "\t\tb.speed = 3;\n" +
            "\t\tb.angle = bossAtan2pl();\n" +
            "\t\tb.x = boss.x;\n" +
            "\t\tb.y = boss.y;\n" +
            "\t}\n" +
            "}"
            // "}"
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
    for (let i = 0; i < Danmaku.patterns.length - 1; i++) {
        let option = document.createElement("option");
        option.value = i;
        if (Danmaku.patterns[i].title != null) {
            option.innerHTML = Danmaku.patterns[i].title;
        } else {
            option.innerHTML = i;
        }
        select.appendChild(option);
    }
    select.onchange = () => {
        game.stop();
        game.setDanmaku(select.value);
    }
}