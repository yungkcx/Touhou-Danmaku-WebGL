let gameloopid = null; // For cancelAnimationFrame().
let gamespeed = MAX_GAMESPEED;
let gl = null;
let editor = null;
let allow_se = false;
let selected_danmaku = -1;

window.onload = () => {
    init().done(() => {
        editor.setValue(
            "function f(s) {\n" +
            "\tif (s.count == 0) {\n" +
            "\t\tlet b = get_bullet(s, 0, 0);\n" +
            "\t\tif (b == null) {\n" +
            "\t\t\treturn;\n" +
            "\t\t}\n" +
            "\t\tb.speed = 3;\n" +
            "\t\tb.angle = bossatan();\n" +
            "\t\tb.x = boss.x;\n" +
            "\t\tb.y = boss.y;\n" +
            "\t}\n" +
            "}"
        );
        addButtonListener();
    });
}

function pause_game() {
    if (gameloopid !== null) {
        cancelAnimationFrame(gameloopid);
        gameloopid = null;
    }
}

function continue_game() {
    if (gameloopid === null) {
        gameloopid = requestAnimationFrame(gameloop);
    }
    document.getElementById("game").focus();
}

function start_game() {
    restart_game();
}

function restart_game() {
    cancelAnimationFrame(gameloopid);
    gameloopid = null;
    init_global();
    gameloopid = requestAnimationFrame(gameloop);
    document.getElementById("game").focus();
}

function gameloop(now) {
    if (stage_count % Math.floor(MAX_GAMESPEED / gamespeed) == 0) {
        se_reset();
        boss_calc();
        player_calc();
        count_fps(now);
        count_total_bullet();
        graph_main();
    }

    if (allow_se) {
        se_play();
    }
    stage_count++;
    gameloopid = requestAnimationFrame(gameloop);
}