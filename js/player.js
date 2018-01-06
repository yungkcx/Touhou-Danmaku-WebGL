function player_calc() {
    player.img = Math.floor((player.count % 64) / 8); // Switch every 8 frames.
    player_move();
    player.count++;
}

function player_move() {
    let move_x = [-player.speed, player.speed, 0, 0],
        move_y = [0, 0, player.speed, -player.speed];
    let input = [
        iskeypressed(KEY_LEFT), iskeypressed(KEY_RIGHT),
        iskeypressed(KEY_DOWN), iskeypressed(KEY_UP)
    ];
    let horizontal_flag = false,
        vertical_flag = false;
    let x, y, mx, my, slant_coef = true;

    // Calculate image.
    if (iskeypressed(KEY_LEFT) && iskeypressed(KEY_RIGHT)) {
        player.vm = 0;
    } else if (iskeypressed(KEY_LEFT) || iskeypressed(KEY_RIGHT)) {
        let coef = iskeypressed(KEY_LEFT) ? 1 : 2;
        if (player.vm < 8) { // Switch every 2 frames.
            player.img = Math.floor(player.vm / 2) + 8 * coef;
        } else { // Switch every 8 frames.
            player.img = Math.floor((player.vm % 32) / 8) + 4 + 8 * coef;
        }
        player.vm++;
    } else {
        player.vm = 0;
    }

    for (let i = 0; i < 2; i++) {
        if (input[i] == true) {
            horizontal_flag = true;
        }
    }
    for (let i = 2; i < 4; i++) {
        if (input[i] == true) {
            vertical_flag = true;
        }
    }
    if (horizontal_flag && vertical_flag) {
        slant_coef = Math.SQRT2;
    }

    for (let i = 0; i < 4; i++) {
        if (input[i] == true) {
            x = player.x;
            y = player.y;
            mx = move_x[i];
            my = move_y[i];
            if (iskeypressed(KEY_SLOW)) { // Slow mode, 1/3 speed.
                mx = move_x[i] / 3;
                my = move_y[i] / 3;
            }
            x += mx / slant_coef, y += my / slant_coef;
            if (!(x < 10 || x > FMX - 10 || y < 5 || y > FMY - 5)) {
                player.x = x;
                player.y = y;
            }
        }
    }
}