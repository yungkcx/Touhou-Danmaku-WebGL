const graph_bullet_layer = [
    [0],
    [3, 4, 1, 6, 7],
    [5, 9, 8],
];

function graph_bullet() {
    graph_bullet_layer.forEach(layer => {
        shot.forEach(s => {
            if (s.flag == true) {
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
        });
    });
}

function graph_board() {
    drawline(0, 0, FMX, 0);
    drawline(0, 0, 0, FMY);
    drawline(FMX, 0, FMX, FMY);
    drawline(0, FMY, FMX, FMY);
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
    graph_bullet();
    graph_board();
}