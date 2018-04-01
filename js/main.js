"use strict";

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
        this.anchor.set(0.5, 0.5);
        this.speedv = {
            x: 0,
            y: 0,
            angle: 0
        };
    }

    get vx() {
        return this.speedv.x;
    }
    set vx(value) {
        this.speedv.x = value;
        this.angle = atan2(this.vy, this.vx);
    }

    get vy() {
        return this.speedv.y;
    }
    set vy(value) {
        this.speedv.y = value;
        this.angle = atan2(this.vy, this.vx);
    }

    get angle() {
        return this.speedv.angle;
    }
    set angle(value) {
        value %= PI2;
        this.speedv.angle = value;
        this.rotation = value + PI / 2;
        let speed = this.speed;
        this.speedv.x = speed * cos(value);
        this.speedv.y = speed * sin(value);
    }

    get speed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }
    set speed(value) {
        let speed = this.speed;
        if (speed === 0) {
            this.speedv.x = value * cos(this.speedv.angle);
            this.speedv.y = value * sin(this.speedv.angle);
        } else {
            this.speedv.x = this.speedv.x * value / speed;
            this.speedv.y = this.speedv.y * value / speed;
        }
    }

    setPos(x, y) {
        this.position.set(x, y);
    }

    // Return the angle of this and (x, y) or another GameObject instance.
    angleTo(xOrObj, y) {
        if (arguments.length === 1 && typeof xOrObj === "object") {
            let obj = xOrObj;
            return atan2(obj.y - this.y, obj.x - this.x);
        } else if (arguments.length === 2 && typeof xOrObj === "number") {
            let x = xOrObj;
            return atan2(y - this.y, x - this.x);
        }
        return 0;
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

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
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
            let n = 4,
                w = 64,
                h = 64;
            if (id === 10) { // Daiyousei.
                n = 3, w = 80, h = 80;
            } else if (id == 11) { // Cirno
                n = 4, w = 64, h = 80;
            }
            let anime = GameUtil.createAnimation(url, n, 0, 0, w, h);
            anime.animationSpeed = 1 / 6;
            this.addChild(anime);
            Boss.chars[id] = anime;
        }
        if (this.animation !== null) {
            this.animation.stop();
            this.animation.visible = false;
        }
        this.animation = Boss.chars[id];
        this.playAnimation();
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    playAnimation() {
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
        this.state = undefined;
        this.baseAngle = [0, 0, 0, 0, 0];
        this.typev = 0;
        this.colorv = 0;
        this.rotate = false;
        Bullet.textures = [];
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

    static setTextures(url) {
        let id = resources[url].textures;
        Bullet.textures = [];
        for (let i in id) {
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
        Laser.textures = [];
        super();
        this.hasSource = false;
        this.isInLaunch = false;
        this.colorv = 0;
        this.maxLength = 0;
        this.count = 0;
        this.physic = {
            on: false,
            startX: 0,
            startY: 0,
            baseX: 0,
            baseY: 0,
            angle: 0,
            baseAngle: 0,
            time: 0,
            count: 0
        };
        this.source = new Sprite();
        this.source.anchor.set(0.5, 0.5);
        this.source.width = 40;
        this.source.height = 40;
        this.addChild(this.source);
        this.alpha = 1;
        this.anchor.set(0, 0.5);
    }

    get angle() {
        return super.angle;
    }
    set angle(value) {
        super.angle = value;
        this.rotation = value;
    }

    get startX() {
        return this.x;
    }
    set startX(value) {
        this.x = value;
        this.source.x = value;
    }

    get startY() {
        return this.y;
    }
    set startY(value) {
        this.y = value;
        this.source.y = value;
    }

    // Return the center (x, y) of the laser.
    get center() {
        let x = this.startX + this.length / 2 * cos(this.angle);
        let y = this.startY + this.length / 2 * sin(this.angle);
        return {
            x: x,
            y: y
        };
    }

    get length() {
        return this.width;
    }
    set length(value) {
        this.width = value;
    }

    get thickness() {
        return this.height;
    }
    set thickness(value) {
        this.height = value;
    }

    get color() {
        return this.colorv;
    }
    set color(value) {
        this.colorv = value;
        this.texture = Laser.textures[value];
        this.source.texture = Bullet.textures[laserSourceId][Math.floor((value % 15 + 1) / 2)];
    }

    hide() {
        this.visible = false;
        this.source.visible = false;
    }

    show() {
        this.visible = true;
    }

    // Set the laser to rotate around about angle radians the fiyed point (y, y).
    rotateAroundPoint(x, y, angle, t) {
        this.physic.on = true;
        this.physic.startX = this.startX;
        this.physic.startY = this.startY;
        this.physic.baseX = x;
        this.physic.baseY = y;
        this.physic.angle = angle;
        this.physic.time = t;
        this.physic.count = 0;
        this.physic.baseAngle = this.angle;
    }

    calcPhysic() {
        let phy = this.physic;
        if (phy.count > phy.time) {
            phy.on = false;
        }
        let ymax = phy.angle;
        let ty = phy.time;
        let t = phy.count;
        let delt = 2 * ymax * t / ty - ymax * t * t / (ty * ty);
        if (ty > 0) {
            this.angle = phy.baseAngle + delt;
        }
        ((x0, y0, mx, my, angle) => {
            let ox = x0 - mx,
                oy = y0 - my;
            this.startX = ox * Math.cos(angle) + oy * Math.sin(angle);
            this.startY = -ox * Math.sin(angle) + oy * Math.cos(angle);
            this.startX += mx;
            this.startY += my;
        })(phy.startX, phy.startY, phy.baseX, phy.baseY, -delt);
        phy.count++;
    }

    update() {
        if (this.isInLaunch) {
            this.hasSource = true;
            this.length += this.speed;
            if (this.length >= this.maxLength) {
                this.length = this.maxLength;
                this.isInLaunch = false;
                this.hasSource = false;
            }
        } else {
            this.move();
        }
        if (this.physic.on) {
            this.calcPhysic();
        }
        if (this.hasSource) {
            this.source.visible = true;
        } else {
            this.source.visible = false;
        }
        if (this.startX < -this.length / 2 || this.startX > FMX + this.length / 2 ||
            this.startY < -this.length / 2 || this.startY > FMY + this.length / 2) {
            this.hide();
        }
        this.count++;
    }

    static setTextures(url) {
        let id = TextureCache[url];
        let height = id.height / laserNum;
        for (let i = 0; i < laserNum; i++) {
            let rect = new Rectangle(0, height * i, id.width, height);
            let texture = new Texture(id, rect);
            Laser.textures.push(texture);
        }
    }
}

class Danmaku extends Container {
    constructor() {
        Danmaku.patterns = [];
        Danmaku.layerData = [
            [25, 26, 33],
            [21],
            [],
            [12, 16, 20, 22],
            [15, 17, 18, 19, 23, 24, 29],
            [1, 2, 10, 13, 14],
            [0, 3, 4, 5, 6, 7, 8, 9, 11, 28],
            [30, 31, 32],
            [27],
        ];
        Danmaku.laserLayer = 2;
        const MAX_BULLET = 6000;
        const MAX_LASER = 200;
        super();
        this.bulletLayers = [];
        this.pattern = null;
        this.bullets = [];
        this.lasers = [];
        for (let i = 0; i < Danmaku.layerData.length + 1; i++) { // +1 for the laser layer.
            let container = new Container();
            this.bulletLayers.push(container);
            this.addChild(container);
        }
        for (let i = 0; i < MAX_BULLET; i++) {
            let b = new Bullet();
            this.bullets.push(b);
        }
        for (let i = 0; i < MAX_LASER; i++) {
            let la = new Laser();
            this.lasers.push(la);
            this.bulletLayers[Danmaku.laserLayer].addChild(la);
        }
        this.lasers.forEach(la => {
            this.bulletLayers[Danmaku.laserLayer].addChild(la.source);
        });
        let filter = new PIXI.filters.ColorMatrixFilter();
        filter.brightness(2);
        filter.blendMode = BLEND_MODES.ADD;
        this.bulletLayers[Danmaku.laserLayer].filters = [filter];
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
            la.source.visible = false;
        });
    }

    hide() {
        this.bulletLayers.forEach(layer => {
            layer.visible = false;
        });
    }

    show() {
        this.bulletLayers.forEach(layer => {
            layer.visible = true;
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
            if (!b.visible) {
                b.visible = true;
                b.rotate = false;
                b.effect = 0;
                b.speed = 0;
                b.state = undefined;
                b.angle = 0;
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

    getLaser(color) {
        if (color < 0 || Laser.textures.length <= color) {
            console.error("Error: Invalid laser color");
            return null;
        }
        for (let la of this.lasers) {
            if (!la.visible) {
                la.visible = true;
                la.hasSource = true;
                la.isInLaunch = false;
                la.count = 0;
                la.speed = 0;
                la.angle = 0;
                la.color = color;
                la.length = 0;
                la.thickness = 0;
                la.maxLength = 0;
                la.physic.on = false;
                return la;
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

    handleLasers(callbackfn) {
        this.lasers.filter(la => {
            return la.visible;
        }).forEach(la => {
            callbackfn(la);
        });
    }

    update(count) {
        if (count < 0) {
            count = NaN;
        }
        sum = 0;
        this.pattern.action(count);
        this.handleBullets(b => {
            b.update();
        });
        this.handleLasers(la => {
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

    static createPattern(titleOrFunc, actionFunc) {
        let obj = {
            title: titleOrFunc,
            action: actionFunc
        };
        if (arguments.length === 1 && typeof titleOrFunc === "function") {
            obj.title = null;
            obj.action = titleOrFunc;
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
        let pathArray = [
            "data/img/bullet/bullet.json",
            "data/img/bullet/laser.png",
        ];
        for (let i = 0; i < playerNum; i++) {
            pathArray.push("data/img/player/pl" + i + ".png");
        }
        for (let i = 0; i < bossNum; i++) {
            pathArray.push("data/img/boss/boss" + i + ".png");
        }
        loader
            .add(pathArray)
            .load(() => {
                Bullet.setTextures(pathArray[0]);
                Laser.setTextures(pathArray[1]);
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
        this.player.show();
        this.player.playAnimation(this.player.states.normal);
        this.boss.show();
        this.boss.putPhysic(FMX / 2, FMY / 4, 50);
        this.boss.playAnimation();
        this.danmaku.show();
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
            "\t\tb.angle = boss.angleTo(player);\n" +
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

    // Select danmaku.
    let seld = document.getElementById("select-danmaku");
    let option = document.createElement("option");
    option.value = -1;
    option.innerHTML = "From editor...";
    seld.appendChild(option);
    for (let i = 0; i < Danmaku.patterns.length - 1; i++) {
        let option = document.createElement("option");
        option.value = i;
        if (Danmaku.patterns[i].title != null) {
            option.innerHTML = Danmaku.patterns[i].title;
        } else {
            option.innerHTML = i;
        }
        seld.appendChild(option);
    }
    seld.onchange = () => {
        game.stop();
    }
    seld.onchange();

    // Select player.
    let selp = document.getElementById("select-player");
    for (let i = 0; i < playerNum; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        selp.appendChild(option);
    }
    selp.onchange = () => {
        game.setPlayer(Number(selp.value));
    }
    selp.onchange();

    // Select boss.
    let selb = document.getElementById("select-boss");
    for (let i = 0; i < bossNum; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.innerHTML = i;
        selb.appendChild(option);
    }
    selb.onchange = () => {
        game.setBoss(Number(selb.value));
    }
    selb.onchange();

    document.getElementById("start").onclick = () => {
        let str = editor.getLine(0);
        let danmakuTitle = str[0] === '"' ? str : "";
        let danmakuFuncStr = editor.getRange({
            line: danmakuTitle === "" ? 0 : 1,
            ch: 0
        }, {
            line: editor.lineCount(),
            ch: 0
        });
        let story_str;
        if (seld.value < 0) {
            let danmaku = danmakuPatterns[danmakuPatterns.length - 1];
            danmaku.title = danmakuTitle;
            str = "danmaku.action=function(t){" + danmakuFuncStr + "}";
            eval(str);
            game.setDanmaku(Number(danmakuPatterns.length - 1));
        } else {
            game.setDanmaku(Number(seld.value));
        }
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
}