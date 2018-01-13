let gameloopid = null; // For cancelAnimationFrame().
let gamespeed = MAX_GAMESPEED;
let gl;
let text_ctx;

window.onload = () => {
    init().done(() => {
        gameloopid = requestAnimationFrame(gameloop);
    });
}

function pause_game() {
    cancelAnimationFrame(gameloopid);
    gameloopid = null;
}

function continue_game() {
    if (gameloopid === null) {
        gameloopid = requestAnimationFrame(gameloop);
    }
}

function restart_game() {
    cancelAnimationFrame(gameloopid);
    gameloopid = null;
    init().done(() => {
        gameloopid = requestAnimationFrame(gameloop);
    });
}

let pre_total_bullet = 0;

function gameloop(now) {
    if (stage_count % Math.floor(MAX_GAMESPEED / gamespeed) == 0) {
        count_fps(now);
        // se_bullet.forEach(se => {
        //     se.flag = false;
        // });
        boss_calc();
        player_calc();
        if (total_bullet > pre_total_bullet) {
            // console.log("total bullet =", total_bullet);
            pre_total_bullet = total_bullet;
        }
        graph_main();
    }

    // se_play();
    stage_count++;
    gameloopid = requestAnimationFrame(gameloop);
}