function SoundEffect(audio) {
    this.flag = false;
    this.audio = audio;
}

function Bullet() {
    this.flag = false;
    this.state = 0;
    this.type = 0;
    this.color = 0;
    this.count = 0;
    this.speed = 0;
    this.state = 0;
    this.kaiten = false;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.till = 0; // Time of existence.
    this.angle = 0;
}

function Shot() {
    this.flag = false;
    this.type = 0;
    this.count = 0;
    this.issc = false;
    this.state = 0;
    this.base_angle = [];
    this.bullet_type = 0;
    this.bullet_color = 0;
    this.bullet = [];
}

// For physical calculation of the boss.
function Boss_phy() {
    this.flag = false;
    this.count = 0;
    this.time = 0;
    this.ax = 0;
    this.v0x = 0;
    this.ay = 0;
    this.v0y = 0;
    this.vx = 0;
    this.vy = 0;
    this.prex = 0;
    this.prey = 0;
}

function Boss(id) {
    this.id = 0;
    this.count = stage_count;
    this.img = 0;
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.phy = new Boss_phy();
}

function Player(id) {
    if (id < 0 || id >= img_player.length) {
        console.error("Error: invalid player id");
        this.id = -1;
    } else {
        this.id = id;
    }
    this.count = stage_count;
    this.img = 0;
    this.vm = 0; // Vertical move fps count.
    this.x = FMX / 2;
    this.y = FMY * 3 / 4;
    this.speed = 5;
}