let shot_bullet = [
    function shot_bullet000(s) {
        if (s.count == 0) {
            let b = get_bullet(s, s.bullet_type, s.bullet_color); //new Bullet(s.bullet_type, s.bullet_color);
            if (b == null) {
                return;
            }
            b.speed = 3;
            b.angle = bossatan();
            b.x = boss.x;
            b.y = boss.y;
            se_bullet[0].flag = true;
        }
    },
    function shot_bullet001(s) {
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
    },
    function shot_bullet002(s) {
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
    },
    function shot_bullet003(s) {
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
    },
    function shot_bullet004(s) {
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
    },
    function shot_bullet005(s) {
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
    },
    function shot_bullet006(s) {
        // 沉默的圣奈
        const TM001 = 60;
        let t = s.count % TM001,
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
        if (t == TM001 / 2 - 1) {
            s.base_angle[0] += PI2 / 20 / 2;
        }
        if (t % (TM001 / 10) == 0) {
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
        if (t == TM001 - 1) {
            this.cnum++;
        }
    },
    function shot_bullet007(s) {
        // 冻符「Perfect Freeze」
        const TM1 = 650;
        let t = s.count % TM1;

        if (t == 0 || t == 210) {
            move_boss(40, 50, FMX - 40, 150, 100, 80);
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
    },
    function shot_bullet008(s) {
        // 禁忌「恋之迷宫」
        const TM001 = 600,
            DF001 = 20;
        let t = s.count % TM001,
            t2 = s.count;
        let tcnt, cnt, cnum;
        if (t2 == 0) {
            input_boss_phy(FMX / 2, FMY / 2, 50);
            cnum = 0;
        }
        if (t == 0) {
            s.base_angle[0] = bossatan();
            cnt = 0;
            tcnt = 2;
        }
        if (t < 540 && t % 3) {
            angle = bossatan();
            if (tcnt - 2 == cnt || tcnt - 1 == cnt) {
                if (tcnt - 1 == cnt) {
                    s.base_angle[1] = s.base_angle[0] + PI2 / DF001 * cnt * (cnum ? -1 : 1) - PI2 / (DF001 * 6) * 3;
                    tcnt += DF001 - 1;
                }
            } else {
                for (let i = 0; i < 6; i++) {
                    let b = get_bullet(s, 8, cnum ? 1 : 4);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = s.base_angle[0] + PI2 / DF001 * cnt * (cnum ? -1 : 1) + PI2 / (DF001 * 6) * i * (cnum ? -1 : 1);
                        b.speed = 2;
                        se_bullet[0].flag = true;
                    }
                }
            }
            cnt++;
        }
        if (40 < t && t < 540 && t % 30 == 0) {
            for (let j = 0; j < 3; j++) {
                let angle = s.base_angle[1] - PI2 / 36 * 4;
                for (let i = 0; i < 27; i++) {
                    let b = get_bullet(s, 7, cnum ? 6 : 0);
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
        if (t == TM001 - 1) {
            cnum++;
        }
    },
];