function get_shot(type) {
    if (type < 0 || type >= shot_bullet.length) {
        console.error("Error: invalid shot_type");
        return null;
    }
    for (let i = 0; i < shot.length; i++) {
        if (shot[i].flag == false) {
            shot[i].count = 0;
            shot[i].flag = true;
            shot[i].type = type;
            return shot[i];
        }
    }
    return null;
}

function get_bullet(s, type, color) {
    if (type < 0 || type >= img_bullet.length) {
        console.error("Error: invalid bullet type");
        return null;
    }
    if (color < 0 || color >= img_bullet[type].length) {
        console.error("Error: invalid bullet color");
        return null;
    }
    for (let i = 0; i < s.bullet.length; i++) {
        if (s.bullet[i].flag == false) {
            s.bullet[i].count = 0;
            s.bullet[i].flag = true;
            s.bullet[i].type = type;
            s.bullet[i].color = color;
            s.bullet[i].state = 0;
            s.bullet[i].kaiten = false;
            return s.bullet[i];
        }
    }
    return null;
};

function get_laser(s, type, color) {
    if (type < 0 || type > img_laser.length) {
        console.error("Error: invalid laser type");
        return null;
    }
    if (color < 0 || color >= img_laser[type].length) {
        console.error("Error: invalid laser color");
        return null;
    }
    for (let i = 0; i < s.laser.length; i++) {
        if (s.laser[i].flag == false) {
            s.laser[i].flag = true;
            s.laser[i].count = 0;
            s.laser[i].type = type;
            s.laser[i].color = color;
            // TODO: other attributes.
            return s.laser[i];
        }
    }
    return null;
}

function shot_enter() {
    story.forEach(st => {
        if (st.start_time == boss.count) {
            let s = get_shot(st.shot_type);
            if (s == null) {
                return;
            }
            s.bullet_type = st.bullet_type;
            s.bullet_color = st.bullet_color;
            console.log("Entered shot, type = " + s.type + ", bullet_type = " + s.bullet_type + ", stage_count = " + stage_count);
            if (shot_bullet[s.type].title !== null) {
                s.issc = true;
                console.log("%c%s", "color: #3399ff", shot_bullet[s.type].title)
            }
        }
    });
}

function laser_calc(s) {
    s.laser.forEach(la => {
        if (la.flag == true) {
            let ymax = la.lphy.angle;
            let ty = la.lphy.time;
            let t = la.count;
            let delt = (2 * ymax * t / ty - ymax * t * t / (ty * ty));
            if (la.lphy.time != 0) {
                la.angle = la.lphy.base_angle + delt;
            }
            if (la.lphy.conv_flag == true) {
                ((x0, y0, mx, my, angle) => {
                    let ox = x0 - mx,
                        oy = y0 - my;
                    la.startX = ox * Math.cos(angle) + oy * Math.sin(angle);
                    la.startY = -ox * Math.sin(angle) + oy * Math.cos(angle);
                    la.startX += mx;
                    la.startY += my;
                })(la.lphy.conv_x, la.lphy.conv_y, la.lphy.conv_base_x, la.lphy.conv_base_y, -delt);
            }
            if (la.count > la.lphy.time) {
                la.lphy.time = 0;
                la.lphy.conv_flag = false;
            }
            la.count++;
        }
    });
}

function shot_calc(s) {
    total_bullet = 0;
    shot.forEach(s => {
        if (s.flag == true) {
            shot_bullet[s.type].shot(s);
            let sum_bullet = 0;

            // Calculate bullets.
            s.bullet.forEach(b => {
                if (b.flag == true) {
                    sum_bullet++;
                    b.x += Math.cos(b.angle) * b.speed;
                    b.y += Math.sin(b.angle) * b.speed;
                    b.count++;
                    // Judge if the bullet is out of the screen.
                    if (b.x < -50 || b.x > FMX + 50 || b.y < -50 || b.y > FMY + 50) {
                        if (b.till <= b.count) { // And is expired.
                            b.flag = false; // Delete.
                            sum_bullet--;
                        }
                    }
                }
            });

            s.count++;
            if (sum_bullet == 0 && s.issc == false) { // If there is no bullet and isn't spell card.
                s.flag = false; // Delete.
                input_boss_phy(BOSS_POS_X, BOSS_POS_Y, 60); // Make the boss return.
                console.log("Removed shot, type =", s.type);
            }
            total_bullet += sum_bullet;

            // Calculate laser of the shot.
            laser_calc(s);
        }
    });
}

function shot_main() {
    shot_enter();
    shot_calc();
}