let shot_bullet = [
    create_danmaku(function f000(s) {
        if (s.count == 0) {
            let b = get_bullet(s, s.bullet_type, s.bullet_color);
            if (b == null) {
                return;
            }
            b.speed = 3;
            b.angle = bossatan();
            b.x = boss.x;
            b.y = boss.y;
            se_bullet[0].flag = true;
        }
    }),
    create_danmaku(function f001(s) {
        let t = s.count;
        if (t >= 0 && t <= 150 && t % 10 == 0) {
            for (let i = 0; i < 20; i++) {
                let b = get_bullet(s, 7, 2);
                if (b == null) {
                    return;
                }
                b.angle = PI * 2 / 20 * i;
                b.x = boss.x + Math.cos(PI / 2 + PI / 150 * t) * 100;
                b.y = boss.y + Math.sin(PI / 2 + PI / 150 * t) * 100;
                b.speed = 1.2;
            }
            for (let i = 0; i < 20; i++) {
                let b = get_bullet(s, 7, 4);
                if (b == null) {
                    return;
                }
                b.angle = PI * 2 / 20 * i;
                b.x = boss.x + Math.cos(PI / 2 - PI / 150 * t) * 100;
                b.y = boss.y + Math.sin(PI / 2 - PI / 150 * t) * 100;
                b.speed = 1.2;
                se_bullet[0].flag = true;
            }
        }
    }),
    create_danmaku(function f002(s) {
        let t = s.count;
        if (t >= 0 && t < 120 && t % 20 == 0) {
            let angle = bossatan();
            for (let i = 0; i < 20; i++) {
                let b = get_bullet(s, s.bullet_type, s.bullet_color);
                if (b != null) {
                    b.angle = angle + PI2 / 20 * i;
                    b.x = boss.x;
                    b.y = boss.y;
                    b.speed = 4;
                    se_bullet[0].flag = true;
                }
            }
        }
    }),
    create_danmaku(function f003(s) {
        let t = s.count;
        if (t >= 0 && t < 120 && t % 2 == 0) {
            let b = get_bullet(s, s.bullet_type, s.bullet_color);
            if (b != null) {
                b.angle = bossatan() + range(PI / 4);
                b.x = boss.x;
                b.y = boss.y;
                b.speed = 3 + range(1.5);
                se_bullet[0].flag = true;
            }
        }
    }),
    create_danmaku(function f004(s) {
        let t = s.count;
        if (t >= 0 && t < 120 && t % 2 == 0) {
            let b = get_bullet(s, s.bullet_type, s.bullet_color);
            if (b != null) {
                b.angle = bossatan() + range(PI / 4);
                b.x = boss.x;
                b.y = boss.y;
                b.speed = 4 + range(2);
                se_bullet[0].flag = true;
            }
        }
        s.bullet.forEach(b => {
            if (b.flag == true) {
                if (b.speed > 1.5) {
                    b.speed -= 0.04;
                }
            }
        });
    }),
    create_danmaku(function f005(s) {
        let t = s.count % 120;
        let t2 = s.count;
        if ((t2 >= 0 && t2 < 240) && (t < 60 && t % 10 == 0)) {
            let angle = bossatan();
            for (let i = 0; i < 30; i++) {
                let b = get_bullet(s, s.bullet_type, s.bullet_color);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.speed = 3;
                    b.angle = angle + PI2 / 30 * i;
                    se_bullet[0].flag = 1;
                }
            }
        }
    }),
    create_danmaku("月符「Silent Selene」", function f006(s) {
        const TM1 = 60;
        let t = s.count % TM1,
            t2 = s.count;
        let angle;
        this.cnum = this.cnum || 0;

        if (t2 == 0) {
            this.cnum = 0;
        }
        if (t == 0) {
            s.base_angle[0] = bossatan();
            if (this.cnum % 2 == 0) {
                move_boss(40, 30, FMX - 40, 120, 60, 60);
            }
        }
        if (t == TM1 / 2 - 1) {
            s.base_angle[0] += PI2 / 20 / 2;
        }
        if (t % (TM1 / 10) == 0) {
            angle = bossatan();
            for (let i = 0; i < 20; i++) {
                let b = get_bullet(s, 8, 7);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = s.base_angle[0] + PI2 / 20 * i;
                    b.speed = 2.7;
                    se_bullet[0].flag = true;
                }
            }
        }
        if (t % 4 == 0) {
            let b = get_bullet(s, 8, 0);
            if (b != null) {
                b.x = getrand(FMX);
                b.y = getrand(200);
                b.angle = PI / 2;
                b.speed = 1 + range(0.5);
                se_bullet[0].flag = true;
            }
        }
        if (t == TM1 - 1) {
            this.cnum++;
        }
    }),
    create_danmaku("冻符「Perfect Freeze」", function f007(s) {
        const TM1 = 650;
        let t = s.count % TM1;

        if (t == 0 || t == 210) {
            move_boss(50, 65, FMX - 50, 170, 120, 80);
        }
        if (t < 180) {
            for (let i = 0; i < 4; i++) {
                let b = get_bullet(s, 7, getrand(6));
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = range(PI2 / 20) + PI2 / 10 * t;
                    b.speed = 3.2 + range(2.1);
                    b.kaiten = true;
                }
            }
            if (t % 10 == 0) {
                se_bullet[0].flag = true;
            }
        }
        if (t > 210 && t < 270 && t % 3 == 0) {
            let angle = bossatan();
            for (let i = 0; i < 16; i++) {
                let b = get_bullet(s, 7, 0);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = angle - PI / 2 * 0.8 + PI * 0.8 / 7 * i + range(PI / 180);
                    b.speed = 3 + range(0.3);
                    b.kaiten = true;
                }
            }
            if (t % 10 == 0) {
                se_bullet[0].flag = true;
            }
        }
        s.bullet.forEach(b => {
            if (b.flag == true) {
                if (b.state == 0) {
                    if (t == 190) {
                        b.kaiten = false;
                        b.speed = 0;
                        b.color = 9;
                        b.count = 0;
                        b.state = 1;
                    }
                }
                if (b.state == 1) {
                    if (b.count == 200) {
                        b.angle = range(PI);
                        b.kaiten = true;
                    }
                    if (b.count > 200) {
                        b.speed += 0.01;
                    }
                }
            }
        });
    }),
    create_danmaku("禁忌「恋之迷宫」", function f008(s) {
        const TM1 = 600,
            DF1 = 20;
        let t = s.count % TM1,
            t2 = s.count;
        let left_or_right = this.cnum % 2 ? -1 : 1;
        this.tcnt = this.tcnt | 0;
        this.cnt = this.cnt | 0;
        this.cnum = this.cnum | 0;

        if (t2 == 0) {
            input_boss_phy(FMX / 2, FMY / 2, 50);
            this.cnum = 0;
        }
        if (t == 0) {
            s.base_angle[0] = bossatan();
            this.cnt = 0;
            this.tcnt = 2;
        }
        if (t < 540 && t % 3 != 0) {
            let angle = bossatan();
            if (this.tcnt - 2 == this.cnt || this.tcnt - 1 == this.cnt) {
                if (this.tcnt - 1 == this.cnt) {
                    s.base_angle[1] = s.base_angle[0] + PI2 / DF1 * this.cnt * left_or_right - PI2 / (DF1 * 6) * 3;
                    this.tcnt += DF1 - 2;
                }
            } else {
                for (let i = 0; i < 6; i++) {
                    let b = get_bullet(s, 8, this.cnum % 2 ? 1 : 4);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = s.base_angle[0] + PI2 / DF1 * this.cnt * left_or_right + PI2 / (DF1 * 6) * i * left_or_right;
                        b.speed = 2;
                        se_bullet[0].flag = true;
                    }
                }
            }
            this.cnt++;
        }
        if (40 < t && t < 540 && t % 30 == 0) {
            for (let j = 0; j < 3; j++) {
                let angle = s.base_angle[1] - PI2 / 36 * 4;
                for (let i = 0; i < 27; i++) {
                    let b = get_bullet(s, 7, this.cnum % 2 ? 6 : 0);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = angle;
                        b.speed = 4 - 1.6 / 3 * j;
                        se_bullet[0].flag = true;
                    }
                    angle -= PI2 / 36;
                }
            }
        }
        if (t == TM1 - 1) {
            this.cnum++;
        }
    }),
    create_danmaku("土著神「小小青蛙不输风雨」", function f009(s) {
        const TM = 200;
        let t = s.count % TM,
            t2 = s.count;
        this.tm = this.tm | 0;

        if (t == 0) {
            this.tm = 190 + range(30);
        }
        let angle = PI * 1.5 + PI / 6 * Math.sin(PI2 / this.tm * t2);
        if (t2 % 4 == 0) {
            for (let i = 0; i < 8; i++) {
                let b = get_bullet(s, 4, 0);
                if (b != null) {
                    b.state = 0;
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = 0;
                    b.vx = Math.cos(angle - PI / 8 * 4 + PI / 8 * i + PI / 16) * 3;
                    b.vy = Math.sin(angle - PI / 8 * 4 + PI / 8 * i + PI / 16) * 3;
                }
            }
            se_bullet[0].flag = true;
        }
        if (t % 1 == 0 && t2 > 80) {
            let num = 1;
            if (t % 2 != 0) {
                num = 2;
            }
            for (let i = 0; i < num; i++) {
                let b = get_bullet(s, 8, 1);
                if (b != null) {
                    let angle = PI * 1.5 - PI / 2 + PI / 12 * (t2 % 13) + range(PI / 15);
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = 0;
                    b.state = 1;
                    b.vx = Math.cos(angle) * 1.4 * 1.2;
                    b.vy = Math.sin(angle) * 1.4;
                }
            }
        }
        s.bullet.forEach(b => {
            if (b.flag == true) {
                if (b.state == 0) {
                    if (b.count < 150) {
                        b.vy += 0.03;
                    }
                    b.x += b.vx;
                    b.y += b.vy;
                } else if (b.state == 1) {
                    if (b.count < 160) {
                        b.vy += 0.03;
                    }
                    b.x += b.vx;
                    b.y += b.vy;
                    b.angle = Math.atan2(b.vy, b.vx);
                }
            }
        });
    }),
    create_danmaku("「反魂蝶 -八分咲-」", function f010(s) {
        const TM = 420;
        const DIST = 60;
        let t = s.count % TM,
            t2 = s.count;
        this.num = this.num | 0;
        if (t2 == 0) {
            this.num = 4;
        }
        if (t == 0) {
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < this.num; i++) {
                    let plmn = (j ? -1 : 1);
                    let la = get_laser(s, 0, j);
                    if (la != null) {
                        la.angle = PI2 / this.num * i + PI2 / (this.num * 2) * j + PI2 / (this.num * 4) * ((this.num + 1) % 2);
                        la.startX = boss.x + Math.cos(la.angle) * DIST;
                        la.startY = boss.y + Math.sin(la.angle) * DIST;
                        la.width = 2;
                        la.height = 440;
                        la.state = j;
                        la.lphy.conv_flag = true;
                        la.lphy.conv_base_x = boss.x;
                        la.lphy.conv_base_y = boss.y;
                        la.lphy.conv_x = la.startX;
                        la.lphy.conv_y = la.startY;
                        la.lphy.angle = PI / this.num * plmn;
                        la.lphy.base_angle = la.angle;
                        la.lphy.time = 80;
                    }
                }
            }
            se_bullet[1].flag = true;
        }
        if (t == 50) {
            let angle = range(PI);
            for (let i = 0; i < 2; i++) {
                for (let k = 0; k < 3; k++) {
                    for (let j = 0; j < 3; j++) {
                        for (let m = 0; m < 40; m++) {
                            let b = get_bullet(s, 11, i);
                            if (b != null) {
                                b.x = boss.x;
                                b.y = boss.y;
                                b.angle = angle + PI2 / 40 * m + PI2 / 80 * i;
                                b.speed = 1.8 - 0.2 * j + 0.1 * i;
                                b.state = k;
                            }
                            se_bullet[0].flag = true;
                        }
                    }
                }
            }
        }
        if (t >= 170 && t < 310 && (t - 170) % 35 == 0) {
            let div = ((t - 170) % 70 == 0) ? -1 : 1;
            let angle = range(PI);
            for (let i = 0; i < 2; i++) {
                for (let k = 0; k < 3; k++) {
                    for (let m = 0; m < 40; m++) {
                        let b = get_bullet(s, 11, 2);
                        if (b != null) {
                            b.x = boss.x;
                            b.y = boss.y;
                            b.angle = angle + PI2 / 40 * m;
                            b.speed = 2 - 0.3 * i;
                            b.state = 10 + k;
                            b.base_angle[0] = PI / 400 * div;
                        }
                    }
                }
                se_bullet[0].flag = true;
            }
        }
        if (t == 360) {
            let angle = range(PI);
            for (let k = 0; k < 3; k++) {
                for (let m = 0; m < 40; m++) {
                    let b = get_bullet(s, 0, 1);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = angle + PI2 / 40 * m;
                        b.speed = 1.8;
                        b.state = 20 + k;
                    }
                }
            }
            se_bullet[0].flag = true;
        }
        s.bullet.forEach(b => {
            if (b.flag == true) {
                let count = b.count;
                let state = b.state;
                switch (state % 10) {
                    case 0:
                        if (count > 90 && count <= 100) {
                            b.speed -= b.speed / 220;
                        }
                        break;
                    case 1:
                        if (count > 50) {
                            b.speed += b.speed / 45;
                        }
                        break;
                    case 2:
                        if (count > 65) {
                            b.speed += b.speed / 90;
                        }
                        break;
                }
                if (10 <= state && state <= 12 && count > 15 && count <= 80) {
                    b.angle += b.base_angle[0];
                }
            }
        });
        s.laser.forEach(la => {
            if (la.flag == true) {
                let count = la.count;
                let state = la.state;
                if (state == 0 || state == 1) {
                    if (count == 80) {
                        la.width = 20;
                    } else if (count >= 260 && count <= 290) {
                        la.width = 10 * (30 - (count - 260)) / 30;
                        if (count == 290) {
                            la.flag = false;
                        }
                    }
                }
            }
        });
        if (t == TM - 1) {
            this.num++;
            if (this.num > 8) {
                this.num = 4;
            }
        }
    }),
    create_danmaku(function f011(s) {
        const TM = 170;
        const NSTATE = 5;
        let t = s.count % TM,
            t2 = s.count,
            t3 = s.count % (TM * 5);
        this.num = this.num | 0;
        if (t2 == 0) {
            this.num = 0;
        }
        if (t == 0 && (0 <= t3 && t3 < TM * 3)) {
            const DNUMX = 20;
            let xlen = FMX / DNUMX;
            let dnumy = Math.floor(FMY / xlen);
            let ylen = FMY / dnumy;
            let x = 0,
                y = 0,
                angle = 0;
            for (let j = 0; j < 4; j++) {
                let to = j % 2 ? dnumy : DNUMX;
                x += Math.cos(angle) * xlen;
                y += Math.sin(angle) * ylen;
                for (let i = 0; i < to - 1; i++) {
                    let b = get_bullet(s, 4, 0);
                    if (b != null) {
                        b.x = x;
                        b.y = y;
                        switch (this.num) {
                            case 0:
                                b.color = 0;
                                b.angle = bulletatan(b, FMX / 2, FMY / 2);
                                b.speed = 1.3;
                                b.state = 0;
                                break;
                            case 1:
                                b.color = 3;
                                b.angle = bulletatan(b, FMX / 2, FMY / 2);
                                b.speed = 1.4 + ((j % 2 ? -1 : 1) * ((Math.cos(PI2 / to * i - PI) + 1) / 2)) * 0.4;
                                b.state = 1;
                                break;
                            case 2:
                                b.color = 6;
                                b.angle = bulletatan(b, FMX / 2, FMY / 2);
                                b.speed = 1.3;
                                b.state = 2;
                                b.base_angle[0] = PI / 1000 * (j % 2 ? -1 : 1) * ((Math.cos(PI2 / to * i - PI) + 1) / 2);
                                break;
                            default:
                                break;
                        }
                        se_bullet[0].flag = true;
                    }
                    x += Math.cos(angle) * xlen;
                    y += Math.sin(angle) * ylen;
                }
                angle += PI / 2;
            }
        } else if (t == 0 && (TM * 3 <= t3 && t3 < TM * NSTATE)) {
            const DNUMX = 12;
            let xlen = FMX / DNUMX;
            let dnumy = Math.floor(FMY / xlen);
            let ylen = FMY / dnumy;
            let x = 0,
                y = 0,
                angle = 0;
            for (let j = 0; j < 4; j++) {
                let to = j % 2 ? dnumy : DNUMX;
                for (let i = 0; i < to; i++) {
                    for (let k = 0; k < 2; k++) {
                        let b = get_bullet(s, 4, 0);
                        if (b != null) {
                            b.x = x;
                            b.y = y;
                            switch (this.num) {
                                case 3:
                                    b.color = 0;
                                    b.angle = angle + PI / 2;
                                    b.speed = 1.1 + 0.5 * k;
                                    b.state = 3;
                                    break;
                                case 4:
                                    b.color = 3;
                                    b.angle = angle + PI / 2 - PI / 14 + PI / 7 * k;
                                    b.speed = 1.3;
                                    b.state = 4;
                                default:
                                    break;
                            }
                            se_bullet[0].flag = true;
                        }
                    }
                    x += Math.cos(angle) * xlen;
                    y += Math.sin(angle) * ylen;
                }
                angle += PI / 2;
            }
        }
        s.bullet.forEach(b => {
            if (b.flag == true) {
                if (b.state == 2) {
                    b.angle += b.base_angle[0];
                }
            }
        });
        if (t == TM - 1) {
            this.num = (this.num + 1) % NSTATE;
        }
    }),
];