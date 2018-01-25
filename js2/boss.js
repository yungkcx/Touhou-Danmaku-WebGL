// For accelarating move.
function input_boss_phy(x, y, t) {
    let ymax_x, ymax_y;
    let phy = boss.phy;
    if (t == 0) {
        t = 1;
    }
    phy.flag = true;
    phy.count = 0;
    phy.time = t;
    ymax_x = boss.x - x;
    phy.v0x = 2 * ymax_x / t;
    phy.ax = 2 * ymax_x / (t * t);
    phy.prex = boss.x;
    ymax_y = boss.y - y;
    phy.v0y = 2 * ymax_y / t;
    phy.ay = 2 * ymax_y / (t * t);
    phy.prey = boss.y;
}

// Move dist in t. The x1, y1, x2, y2 is the field.
function move_boss(x1, y1, x2, y2, dist, t) {
    for (let i = 0; i < 1000; i++) {
        let x = boss.x,
            y = boss.y;
        let angle = range(PI);
        x += Math.cos(angle) * dist;
        y += Math.sin(angle) * dist;
        if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
            input_boss_phy(x, y, t);
            return true;
        }
    }
    return false; // Failed.
}

function phy_calc() {
    let t = boss.phy.count;
    boss.x = boss.phy.prex - ((boss.phy.v0x * t) - 0.5 * boss.phy.ax * t * t);
    boss.y = boss.phy.prey - ((boss.phy.v0y * t) - 0.5 * boss.phy.ay * t * t);
    boss.phy.count++;
    if (boss.phy.count >= boss.phy.time) {
        boss.phy.flag = false;
    }
}

function boss_enter(id) {
    boss = new Boss(id);
    if (id < 0 || id >= img_boss.length) {
        console.error("Error: invalid boss id");
        boss.id = -1;
    } else {
        boss.id = id;
    }
    boss.x = BOSS_POS_X;
    boss.y = -50;
    input_boss_phy(BOSS_POS_X, BOSS_POS_Y, 60);
}

function boss_calc() {
    if (boss.phy.flag == true) {
        phy_calc();
    }
    boss.dx = boss.x;
    boss.dy = boss.y + Math.sin(PI2 / 130 * (stage_count % 130)) * 10;
    boss.img = Math.floor((boss.count % 32) / 8);
    shot_main(); // Shot.
    boss.count++;
}