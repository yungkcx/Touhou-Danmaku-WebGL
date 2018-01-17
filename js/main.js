let gameloopid = null; // For cancelAnimationFrame().
let gamespeed = MAX_GAMESPEED;
let gl;
let editor = null;
let allow_se = false;

window.onload = () => {
    init().done(() => {
        editor.setValue(
            "function f(s) {\n" +
            "   if (s.count == 0) {\n" +
            "       let b = get_bullet(s, s.bullet_type, s.bullet_color);\n" +
            "       if (b == null) {\n" +
            "           return;\n" +
            "       }\n" +
            "       b.speed = 3;\n" +
            "       b.angle = bossatan();\n" +
            "       b.x = boss.x;\n" +
            "       b.y = boss.y;\n" +
            "   }\n" +
            "}"
        );

        document.onkeydown = handlekey("down");
        document.onkeyup = handlekey("up");

        document.getElementById("start").onclick = () => {
            let str = editor.getLine(0);
            let danmaku_title = str[0] === '"' ? str : "";
            let danmaku_func = editor.getRange({
                line: danmaku_title === "" ? 0 : 1,
                ch: 0
            }, {
                line: editor.lineCount(),
                ch: 0
            });
            str = "shot_bullet.push(create_danmaku(" +
                danmaku_title + (danmaku_title === "" ? "" : ",") +
                danmaku_func + "));" +
                "story=[add_danmaku(60,shot_bullet.length-1,0,0)];";
            eval(str);
            start_game();
        };
        document.getElementById("pause").onclick = () => {
            pause_game()
        };
        document.getElementById("continue").onclick = () => {
            continue_game()
        };
        document.getElementById("restart").onclick = () => {
            restart_game()
        }
        let se_checkbox = document.getElementById("sound-effect");
        se_checkbox.onchange = () => {
            if (se_checkbox.checked) {
                allow_se = true;
            } else {
                allow_se = false;
            }
        }
        se_checkbox.onchange();
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
}

function start_game() {
    restart_game();
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
        se_reset();
        boss_calc();
        player_calc();
        if (total_bullet > pre_total_bullet) {
            // console.log("total bullet =", total_bullet);
            pre_total_bullet = total_bullet;
        }
        graph_main();
    }

    if (allow_se) {
        se_play();
    }
    stage_count++;
    gameloopid = requestAnimationFrame(gameloop);
}