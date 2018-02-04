let getBullet = game.danmaku.getBullet.bind(game.danmaku),
    getLaser = game.danmaku.getLaser.bind(game.danmaku),
    createDanmaku = Danmaku.createPattern,
    boss = game.boss,
    player = game.player,
    range = GameUtil.rangeAngle,
    randInt = GameUtil.randInt,
    randArray = GameUtil.randArray,
    handleBullets = game.danmaku.handleBullets.bind(game.danmaku),
    handleLasers = game.danmaku.handleLasers.bind(game.danmaku),
    baseAngle = [];

let danmakuPatterns = [
    createDanmaku(function f000(t) {
        if (t == 0) {
            let b = getBullet(0, 0);
            if (b == null) {
                return;
            }
            b.angle = boss.angleTo(player);
            b.speed = 3;
            b.x = boss.x;
            b.y = boss.y;
        }
    }),
    createDanmaku(function f001(t) {
        if (t >= 0 && t <= 150 && t % 10 == 0) {
            for (let i = 0; i < 20; i++) {
                let b = getBullet(7, 2);
                if (b == null) {
                    return;
                }
                b.angle = PI * 2 / 20 * i;
                b.x = boss.x + cos(PI / 2 + PI / 150 * t) * 100;
                b.y = boss.y + sin(PI / 2 + PI / 150 * t) * 100;
                b.speed = 1.2;
            }
            for (let i = 0; i < 20; i++) {
                let b = getBullet(7, 4);
                if (b == null) {
                    return;
                }
                b.angle = PI * 2 / 20 * i;
                b.x = boss.x + cos(PI / 2 - PI / 150 * t) * 100;
                b.y = boss.y + sin(PI / 2 - PI / 150 * t) * 100;
                b.speed = 1.2;
            }
        }
    }),
    createDanmaku(function f002(t) {
        if (t >= 0 && t < 120 && t % 20 == 0) {
            let angle = boss.angleTo(player);
            for (let i = 0; i < 20; i++) {
                let b = getBullet(0, 0);
                if (b != null) {
                    b.angle = angle + PI2 / 20 * i;
                    b.x = boss.x;
                    b.y = boss.y;
                    b.speed = 4;
                }
            }
        }
    }),
    createDanmaku(function f003(t) {
        if (t >= 0 && t < 120 && t % 2 == 0) {
            let b = getBullet(0, 0);
            if (b != null) {
                b.angle = boss.angleTo(player) + range(PI / 4);
                b.x = boss.x;
                b.y = boss.y;
                b.speed = 3 + range(1.5);
            }
        }
    }),
    createDanmaku(function f004(t) {
        if (t >= 0 && t < 120 && t % 2 == 0) {
            let b = getBullet(0, 0);
            if (b != null) {
                b.angle = boss.angleTo(player) + range(PI / 4);
                b.x = boss.x;
                b.y = boss.y;
                b.speed = 4 + range(2);
            }
        }
        handleBullets(b => {
            if (b.speed > 1.5) {
                b.speed -= 0.04;
            }
        });
    }),
    createDanmaku("弹量测试", function f005(t) {
        const NBULLET = 324;
        if (t == 0) {
            boss.putPhysic(FMX / 2, FMY / 2, 50);
        }
        if (t % 10 == 0 && t >= 50) {
            let angle = boss.angleTo(player);
            for (let i = 0; i < NBULLET; i++) {
                let b = getBullet(8, 1);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.speed = 2;
                    b.angle = angle + PI2 / NBULLET * i;
                }
            }
        }
    }),
    createDanmaku("月符「Silent Selene」", function f006(t) {
        const TM1 = 60;
        let t2 = t % TM1;
        let angle;
        this.cnum = this.cnum || 0;

        if (t == 0) {
            this.cnum = 0;
        }
        if (t2 == 0) {
            baseAngle[0] = boss.angleTo(player);
            if (this.cnum % 2 == 0) {
                boss.randMove(40, 30, FMX - 40, 120, 60, 60);
            }
        }
        if (t2 == TM1 / 2 - 1) {
            baseAngle[0] += PI2 / 20 / 2;
        }
        if (t2 % (TM1 / 10) == 0) {
            angle = boss.angleTo(player);
            for (let i = 0; i < 20; i++) {
                let b = getBullet(3, 8);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = baseAngle[0] + PI2 / 20 * i;
                    b.speed = 2.7;
                }
            }
        }
        if (t2 % 4 == 0) {
            let b = getBullet(3, 6);
            if (b != null) {
                b.x = randInt(FMX);
                b.y = randInt(200);
                b.angle = PI / 2;
                b.speed = 1 + range(0.5);
            }
        }
        if (t2 == TM1 - 1) {
            this.cnum++;
        }
    }),
    createDanmaku("冻符「Perfect Freeze」", function f007(t) {
        const TM1 = 650;
        let t2 = t % TM1;

        if (t2 == 0 || t2 == 210) {
            boss.randMove(50, 65, FMX - 50, 170, 120, 80);
        }
        if (t2 < 140) {
            for (let i = 0; i < 4; i++) {
                let b = getBullet(1, [2, 6, 10, 13][randInt(4)]);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = range(PI2 / 20) + PI2 / 10 * t;
                    b.speed = 3.2 + range(2.1);
                    b.rotate = true;
                    b.state = 0;
                }
            }
        }
        if (t2 > 210 && t2 < 270 && t2 % 3 == 0) {
            let angle = boss.angleTo(player);
            for (let i = 0; i < 7; i++) {
                let b = getBullet(2, 5);
                if (b != null) {
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = angle - PI / 2 * 0.7 + PI * 0.7 / 6 * i + range(PI / 180);
                    b.speed = 3 + range(0.3);
                    b.state = 2;
                }
            }
        }
        handleBullets(b => {
            if (b.state == 0) {
                if (t2 == 190) {
                    b.rotate = false;
                    b.speed = 0;
                    b.color = 15;
                    b.count = 0;
                    b.state = 1;
                }
            }
            if (b.state == 1) {
                if (b.count == 200) {
                    b.angle = range(PI);
                    b.rotate = true;
                }
                if (b.count > 200) {
                    b.speed += 0.01;
                }
            }
        });
    }),
    createDanmaku("禁忌「恋之迷宫」", function f008(t) {
        const TM1 = 600,
            DF1 = 20;
        let t2 = t % TM1;
        this.tcnt = this.tcnt | 0;
        this.cnt = this.cnt | 0;
        this.cnum = this.cnum | 0;
        let coef = this.cnum % 2 ? -1 : 1;

        if (t == 0) {
            boss.putPhysic(FMX / 2, FMY / 2, 50);
            this.cnum = 0;
        }
        if (t2 == 0) {
            baseAngle[0] = boss.angleTo(player);
            this.cnt = 0;
            this.tcnt = 2;
        }
        if (t2 < 540 && t2 % 3 != 0) {
            let angle = boss.angleTo(player);
            if (this.tcnt - 2 == this.cnt || this.tcnt - 1 == this.cnt) {
                if (this.tcnt - 1 == this.cnt) {
                    baseAngle[1] = baseAngle[0] + PI2 / DF1 * this.cnt * coef - PI2 / (DF1 * 6) * 3;
                    this.tcnt += DF1 - 2;
                }
            } else {
                for (let i of randArray(6)) {
                    let b = getBullet(3, this.cnum % 2 ? 14 : 8);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = baseAngle[0] + PI2 / DF1 * this.cnt * coef + PI2 / (DF1 * 6) * i * coef;
                        b.speed = 2;
                    }
                }
            }
            this.cnt++;
        }
        if (40 < t2 && t2 < 540 && t2 % 30 == 0) {
            for (let j = 0; j < 3; j++) {
                let angle = baseAngle[1] - PI2 / 36 * 4;
                for (let i = 0; i < 27; i++) {
                    let b = getBullet(2, this.cnum % 2 ? 2 : 6);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = angle;
                        b.speed = 4 - 1.6 / 3 * j;
                    }
                    angle -= PI2 / 36;
                }
            }
        }
        if (t2 == TM1 - 1) {
            this.cnum++;
        }
    }),
    createDanmaku("土著神「小小青蛙不输风雨」", function f009(t) {
        const TM = 200;
        let t2 = t % TM;
        this.tm = this.tm | 0;

        if (t2 == 0) {
            this.tm = 190 + range(30);
        }
        let angle = PI * 1.5 + PI / 6 * sin(PI2 / this.tm * t);
        if (t % 4 == 0) {
            for (let i = 0; i < 8; i++) {
                let b = getBullet(2, 6);
                if (b != null) {
                    b.state = 0;
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = 0;
                    b.effect = 1;
                    b.vx = cos(angle - PI / 8 * 4 + PI / 8 * i + PI / 16) * 3;
                    b.vy = sin(angle - PI / 8 * 4 + PI / 8 * i + PI / 16) * 3;
                }
            }
        }
        if (t2 % 1 == 0 && t > 80) {
            let num = 1;
            if (t2 % 2 != 0) {
                num = 2;
            }
            for (let i = 0; i < num; i++) {
                let b = getBullet(3, 8);
                if (b != null) {
                    let angle = PI * 1.5 - PI / 2 + PI / 12 * (t % 13) + range(PI / 15);
                    b.x = boss.x;
                    b.y = boss.y;
                    b.angle = 0;
                    b.state = 1;
                    b.vx = cos(angle) * 1.4 * 1.2;
                    b.vy = sin(angle) * 1.4;
                }
            }
        }
        handleBullets(b => {
            if (b.state == 0) {
                if (b.count < 150) {
                    b.vy += 0.03;
                }
            } else if (b.state == 1) {
                if (b.count < 160) {
                    b.vy += 0.03;
                }
            }
        });
    }),
    createDanmaku("「反魂蝶 -八分咲-」", function f010(t) {
        const TM = 420;
        const DIST = 60;
        let t2 = t % TM;
        this.num = this.num | 0;
        if (t == 0) {
            this.num = 4;
        }
        if (t2 == 0) {
            for (let j = 0; j < 2; j++) {
                for (let i = 0; i < this.num; i++) {
                    let coef = (j ? -1 : 1);
                    let la = getLaser(j ? 4 : 8);
                    if (la != null) {
                        la.angle = PI2 / this.num * i + PI2 / (this.num * 2) * j + PI2 / (this.num * 4) * ((this.num + 1) % 2);
                        la.startX = boss.x + cos(la.angle) * DIST;
                        la.startY = boss.y + sin(la.angle) * DIST;
                        la.thickness = 1;
                        la.length = 480;
                        la.rotateAroundPoint(boss.x, boss.y, PI / this.num * coef, 80);
                    }
                }
            }
        }
        if (t2 == 50) {
            let angle = range(PI);
            for (let i = 0; i < 2; i++) {
                for (let k = 0; k < 3; k++) {
                    for (let j = 0; j < 3; j++) {
                        for (let m = 0; m < 40; m++) {
                            let b = getBullet(17, i + 2);
                            if (b != null) {
                                b.x = boss.x;
                                b.y = boss.y;
                                b.angle = angle + PI2 / 40 * m + PI2 / 80 * i;
                                b.speed = 1.8 - 0.2 * j + 0.1 * i;
                                b.state = k;
                            }
                        }
                    }
                }
            }
        }
        if (t2 >= 170 && t2 < 310 && (t2 - 170) % 35 == 0) {
            let div = ((t2 - 170) % 70 == 0) ? -1 : 1;
            let angle = range(PI);
            for (let i = 0; i < 2; i++) {
                for (let k = 0; k < 3; k++) {
                    for (let m = 0; m < 40; m++) {
                        let b = getBullet(17, 1);
                        if (b != null) {
                            b.x = boss.x;
                            b.y = boss.y;
                            b.angle = angle + PI2 / 40 * m;
                            b.speed = 2 - 0.3 * i;
                            b.state = 10 + k;
                            b.baseAngle[0] = PI / 400 * div;
                        }
                    }
                }

            }
        }
        if (t2 == 360) {
            let angle = range(PI);
            for (let k = 0; k < 3; k++) {
                for (let m = 0; m < 40; m++) {
                    let b = getBullet(21, 0);
                    if (b != null) {
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = angle + PI2 / 40 * m;
                        b.speed = 1.8;
                        b.state = 20 + k;
                    }
                }
            }
        }
        handleBullets(b => {
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
                b.angle += b.baseAngle[0];
            }
        });
        handleLasers(la => {
            let count = la.count;
            if (80 < count && count <= 85) {
                la.thickness = 20 + 10 * (count - 80) / 10;
            } else if (260 <= count && count <= 290) {
                la.thickness = 30 * (30 - (count - 260)) / 30;
                if (count == 290) {
                    la.hide();
                }
            }
        });
        if (t2 == TM - 1) {
            this.num++;
            if (this.num > 10) {
                this.num = 4;
            }
        }
    }),
    createDanmaku("秘弹「之后就一个人都没有了吗？」", function f011(t) {
        const TM = 170;
        const NSTATE = 5;
        let t1 = t % TM,
            t3 = t % (TM * 5);
        this.num = this.num | 0;
        if (t == 0) {
            this.num = 0;
        }
        if (t == 60) {
            boss.hide();
        }
        if (t1 == 0 && (0 <= t3 && t3 < TM * 3)) {
            const DNUMX = 20;
            let xlen = FMX / DNUMX;
            let dnumy = Math.floor(FMY / xlen);
            let ylen = FMY / dnumy;
            let x = 0,
                y = 0,
                angle = 0;
            for (let j = 0; j < 4; j++) {
                let to = j % 2 ? dnumy : DNUMX;
                x += cos(angle) * xlen;
                y += sin(angle) * ylen;
                for (let i = 0; i < to - 1; i++) {
                    let b = getBullet(2, 0);
                    if (b != null) {
                        b.x = x;
                        b.y = y;
                        switch (this.num) {
                            case 0:
                                b.color = 2;
                                b.angle = b.angleTo(FMX / 2, FMY / 2);
                                b.speed = 1.3;
                                b.state = 0;
                                break;
                            case 1:
                                b.color = 4;
                                b.angle = b.angleTo(FMX / 2, FMY / 2);
                                b.speed = 1.4 + ((j % 2 ? -1 : 1) * ((cos(PI2 / to * i - PI) + 1) / 2)) * 0.4;
                                b.state = 1;
                                break;
                            case 2:
                                b.color = 13;
                                b.angle = b.angleTo(FMX / 2, FMY / 2);
                                b.speed = 1.3;
                                b.state = 2;
                                b.baseAngle[0] = PI / 1000 * (j % 2 ? -1 : 1) * ((cos(PI2 / to * i - PI) + 1) / 2);
                                break;
                            default:
                                break;
                        }

                    }
                    x += cos(angle) * xlen;
                    y += sin(angle) * ylen;
                }
                angle += PI / 2;
            }
        } else if (t1 == 0 && (TM * 3 <= t3 && t3 < TM * NSTATE)) {
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
                        let b = getBullet(2, 0);
                        if (b != null) {
                            b.x = x;
                            b.y = y;
                            switch (this.num) {
                                case 3:
                                    b.color = 6;
                                    b.angle = angle + PI / 2;
                                    b.speed = 1.1 + 0.5 * k;
                                    b.state = 3;
                                    break;
                                case 4:
                                    b.color = 8;
                                    b.angle = angle + PI / 2 - PI / 14 + PI / 7 * k;
                                    b.speed = 1.3;
                                    b.state = 4;
                                default:
                                    break;
                            }

                        }
                    }
                    x += cos(angle) * xlen;
                    y += sin(angle) * ylen;
                }
                angle += PI / 2;
            }
        }
        handleBullets(b => {
            if (b.state == 2) {
                b.angle += b.baseAngle[0];
            }
        });
        if (t1 == TM - 1) {
            this.num = (this.num + 1) % NSTATE;
        }
    }),
    createDanmaku("梦符「梦我梦中」", function f012(t) {
        const TM = 800;
        const DIST = 70;
        const NLASER = 48;
        const INTERVAL = 2;
        const TM2 = NLASER * INTERVAL;
        let t2 = t % TM;
        this.motoarr = this.motoarr || null;
        this.basex = this.basex || null;
        this.basey = this.basey || null;
        if (t2 == 0) {
            this.motoarr = randArray(NLASER, 4);
            this.basex = player.x;
            this.basey = player.y;
        }
        if (t2 < TM2 && t2 % INTERVAL == 0) {
            let i = Math.floor(t2 / INTERVAL);
            let angle = PI2 / NLASER * this.motoarr[i];
            let la = getLaser(5);
            if (la != null) {
                la.isInLaunch = true;
                la.startX = this.basex + cos(angle) * DIST;
                la.startY = this.basey + sin(angle) * DIST;
                la.angle = la.angleTo(this.basex, this.basey) + PI2 / 18;
                la.speed = 3;
                la.thickness = 15;
                la.maxLength = 180;
                la.state = 0;
                let b = getBullet(2, 6);
                if (b != null) {
                    b.x = la.startX;
                    b.y = la.startY;
                    b.speed = 1.5;
                    b.angle = la.angle + PI;
                    b.state = 1;
                }
            }
        }
        handleBullets(b => {
            if (b.visible == true && b.state == 1) {
                if (b.x < 0 || b.x > FMX || b.y < 0) {
                    b.state = 0;
                    if (b.x < 0 || b.x > FMX) {
                        if (b.angle <= PI) {
                            b.angle = PI - b.angle;
                        } else {
                            b.angle = PI * 3 - b.angle;
                        }
                    } else if (b.y < 0) {
                        b.angle = PI2 - b.angle;
                    }
                }
            }
        });
        handleLasers(la => {
            if (la.state < 3) {
                let pt = la.center;
                if (pt.x < 0 || pt.x > FMX || pt.y < 0 || pt.y > FMY) {
                    let la2 = getLaser(0);
                    la2.color = la.color;
                    la2.isInLaunch = true;
                    if (la2 != null) {
                        if (pt.x < 0 || FMX < pt.x) {
                            la2.startX = pt.x < 0 ? 0 : FMX;
                            la2.startY = pt.y;
                            if (la.angle <= PI) {
                                la2.angle = PI - la.angle;
                            } else {
                                la2.angle = PI * 3 - la.angle;
                            }
                        } else if (pt.y < 0 || FMY < pt.y) {
                            la2.startX = pt.x;
                            la2.startY = pt.y < 0 ? 0 : FMY;
                            la2.angle = PI2 - la.angle;
                        }
                        la2.speed = la.speed;
                        la2.thickness = la.thickness;
                        la2.maxLength = la.maxLength;
                        la2.state = la.state + 1;
                    }
                    la.state = 3;
                }
            }
        });
    }),
    createDanmaku("「妖精旋风」", function f013(t) {
        const TM = 1900;
        const TM1 = 900;
        let t2 = t % TM;
        this.num = this.num || 0;
        this.coef = this.coef || false;
        if (t2 == 0) {
            boss.putPhysic(FMX / 2, FMY * 2 / 5, 10);
            this.num = 0;
            this.coef = false;
            baseAngle[0] = 0.04;
        }
        if ((10 <= t2 && t2 < TM1) && t % 10 == 0) {
            for (let i = 0; i < 6; i++) {
                let b = getBullet(0, this.coef % 2 ? 9 : 0);
                if (b != null) {
                    b.speed = 4;
                    b.angle = PI2 / 6 * i + baseAngle * this.num;
                    b.x = boss.x;
                    b.y = boss.y;
                    b.state = 0;
                }
                this.num++;
            }
            this.coef = !this.coef;
        } else if (t2 == TM1) {
            boss.putPhysic(FMX / 2, FMY / 4, 10);
        }
        if ((TM1 * 3 / 4 <= t2 && t2 < TM1 * 5 / 4) && t % 20 == 0) {
            for (let i = 0; i < 12; i++) {
                let b = getBullet(34, 0);
                if (b != null) {
                    b.speed = 3;
                    b.angle = boss.angleTo(player) + PI2 / 12 * i;
                    b.x = boss.x;
                    b.y = boss.y;
                }
            }
        }
        if (TM1 * 5 / 4 <= t2 && t2 < TM1 * 2) {
            if (t2 % 50 == 0) {
                let x = 40 + randInt(FMX - 40),
                    y = 40 + randInt(FMY / 2 - 40);
                boss.putPhysic(x, y, 10);
                for (let i = 0; i < 12; i++) {
                    let b = getBullet(16, 5);
                    if (b != null) {
                        b.speed = 3;
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = boss.angleTo(player) + PI2 / 12 * i;
                    }
                }
            }
            if (t2 % 20 == 0) {
                for (let i = 0; i < 20; i++) {
                    let b = getBullet(4, this.coef ? 9 : 0);
                    if (b != null) {
                        b.speed = 3;
                        b.x = boss.x;
                        b.y = boss.y;
                        b.angle = boss.angleTo(player) + range(PI / 4);
                    }
                }
                this.coef = !this.coef;
            }
        }
        if (Math.floor(t2 / (TM1 / 9)) % 3 == 0 && t2 < TM1) {
            handleBullets(b => {
                if (b.state == 0) {
                    b.angle += baseAngle[0];
                }
            });
        }
    }),
    createDanmaku("nothing", t => {}),
];