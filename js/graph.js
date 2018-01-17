const graph_bullet_layer = [
    [0],
    [1, 3, 4, 6, 7, 11],
    [5, 8, 9, 10],
];

function graph_bullet(s, layer) {
    s.bullet.forEach(b => {
        if (b.flag == true) {
            layer.forEach(bt => {
                if (bt == b.type) {
                    let disp_angle;
                    if (b.kaiten == true) {
                        disp_angle = PI2 * (b.count % 120) / 120;
                    } else {
                        disp_angle = b.angle + PI / 2;
                    }
                    drawImage(img_bullet[b.type][b.color], b.x, b.y, disp_angle);
                    return;
                }
            });
        }
    });
}

function graph_laser(s) {
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    s.laser.forEach(la => {
        if (la.flag == true) {
            drawLaser(img_laser[la.type][la.color], la.startX, la.startY, la.width, la.height, la.angle - PI / 2);
            drawImage(img_laser_moto[la.type][la.color], la.startX, la.startY, 0);
        }
    });
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

function graph_shot() {
    shot.forEach(s => {
        if (s.flag == true) {
            graph_laser(s);
        }
    });
    graph_bullet_layer.forEach(layer => {
        shot.forEach(s => {
            if (s.flag == true) {
                graph_bullet(s, layer);
            }
        });
    });
}

function graph_boss() {
    drawImage(img_boss[boss.id][boss.img], boss.dx, boss.dy, 0);
}

function graph_player() {
    drawImage(img_player[player.id][player.img], player.x, player.y, 0);
}

function graph_main() {
    graph_boss();
    graph_player();
    graph_shot();
}