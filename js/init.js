function load() {
    let donefunc = () => {};
    let addedloading = false;
    let imgloading = 0;
    let imgloaded = 0;

    function imgloadpost() {
        imgloaded++;
        if (imgloaded == imgloading && addedloading == true) {
            donefunc();
        }
    }

    function load_img(src, nx, ny, width, height) {
        let img = new Image();
        let viewports = new Array(nx * ny);
        imgloading++;
        img.src = src;
        img.onload = () => {
            for (let i = 0; i < ny; i++) {
                for (let j = 0; j < nx; j++) {
                    let cvs = document.createElement("canvas");
                    cvs.width = width;
                    cvs.height = height;
                    let ctx = cvs.getContext('2d');
                    ctx.drawImage(img, j * width, i * height, width, height, 0, 0, width, height);
                    viewports[nx * i + j] = cvs;
                }
            }
            imgloadpost();
        }
        return viewports;
    }

    // Sound effect.
    se_bullet[0] = new SoundEffect(new Audio("data/se/enemy_shot.wav"));
    se_bullet[1] = new SoundEffect(new Audio("data/se/laser.wav"));
    // Bullet.
    img_bullet[0] = load_img("data/img/bullet/b0.png", 5, 1, 76, 76);
    img_bullet[3] = load_img("data/img/bullet/b3.png", 5, 1, 19, 34);
    img_bullet[4] = load_img("data/img/bullet/b4.png", 10, 1, 38, 38);
    img_bullet[1] = load_img("data/img/bullet/b1.png", 6, 1, 22, 22);
    img_bullet[6] = load_img("data/img/bullet/b6.png", 3, 1, 14, 18);
    img_bullet[7] = load_img("data/img/bullet/b7.png", 10, 1, 16, 16);
    img_bullet[5] = load_img("data/img/bullet/b5.png", 3, 1, 14, 16);
    img_bullet[9] = load_img("data/img/bullet/b9.png", 3, 1, 13, 19);
    img_bullet[8] = load_img("data/img/bullet/b8.png", 10, 1, 12, 18);
    img_bullet[10] = load_img("data/img/bullet/b10.png", 8, 1, 8, 8);
    img_bullet[2] = load_img("data/img/bullet/b2.png", 10, 1, 5, 120);
    img_bullet[11] = load_img("data/img/bullet/b11.png", 8, 1, 35, 32);
    // Player.
    img_player[0] = load_img("data/img/player/pl00.png", 8, 3, 32, 48);
    img_player[1] = load_img("data/img/player/pl01.png", 8, 3, 32, 48);
    // Boss.
    img_boss[4] = load_img("data/img/boss/boss4.png", 4, 3, 64, 64);
    // Laser.
    img_laser[0] = load_img("data/img/bullet/l0.png", 2, 1, 30, 460);
    img_laser_moto[0] = load_img("data/img/bullet/l0_moto.png", 2, 1, 70, 70);

    addedloading = true;
    return {
        done: f => {
            donefunc = f || donefunc;
        }
    };
}

function init_webgl() {
    let canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.id = "main";
    canvas.width = FMX;
    canvas.height = FMY;
    WebGL2D.enable(canvas);
    gl = canvas.getContext("webgl-2d");
    if (!gl) {
        gl = canvas.getContext('2d');
    }
    gl.clearRect(0, 0, FMX, FMY);
}

function init_fps_text() {
    text_canvas = document.createElement("canvas");
    document.body.appendChild(text_canvas);
    text_canvas.id = "fps-text";
    text_canvas.width = 70;
    text_canvas.height = 25;
    text_canvas.style.left = (FMX - text_canvas.width) + "px";
    text_canvas.style.top = (FMY - text_canvas.height) + "px";
    text_ctx = text_canvas.getContext('2d');
    text_ctx.fillStyle = "white";
    text_ctx.font = "12px monospace";
}

function init_key() {
    document.addEventListener("keydown", handlekey("down"), false);
    document.addEventListener("keyup", handlekey("up"), false);
}

function init() {
    let donefunc = () => {};

    load().done(() => { // Wait for loading images.
        init_webgl();
        init_fps_text();
        init_key();

        gameloopid = null;
        stage_count = 0;

        boss_enter(4);
        player = new Player(0);

        shot = new Array(MAX_SHOT);
        for (let i = 0; i < MAX_SHOT; i++) {
            shot[i] = new Shot(0);
            shot[i].bullet = new Array(MAX_SHOT_BULLET);
            for (let j = 0; j < MAX_SHOT_BULLET; j++) {
                shot[i].bullet[j] = new Bullet();
            }
            for (let j = 0; j < MAX_SHOT_LASER; j++) {
                shot[i].laser[j] = new Laser();
            }
        }
        donefunc();
    });

    return {
        done: f => {
            donefunc = f || donefunc;
        }
    };
}