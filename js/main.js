let gameloopid = null; // For cancelAnimationFrame().
let gamespeed = MAX_GAMESPEED;
let gl;
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

        let game = document.getElementById("game");
        game.onkeydown = handlekey("down");
        game.onkeyup = handlekey("up");

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
            let story_str;
            if (selected_danmaku < 0) {
                story_str = "story=[add_danmaku(60,shot_bullet.length-1,0,0)];";
            } else {
                story_str = "story=[add_danmaku(60,selected_danmaku,0,0)];";
            }
            str = "shot_bullet[shot_bullet.length-1]=create_danmaku(" +
                danmaku_title + (danmaku_title === "" ? "" : ",") +
                danmaku_func + ");" + story_str;
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

        let select = document.getElementById("select-danmaku");
        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "From editor...";
        select.appendChild(option);
        for (let i = 0; i < shot_bullet.length - 1; i++) {
            let option = document.createElement("option");
            option.value = i;
            if (shot_bullet[i].title != null) {
                option.innerHTML = shot_bullet[i].title;
            } else {
                option.innerHTML = i;
            }
            select.appendChild(option);
        }
        select.onchange = () => {
            selected_danmaku = select.value;
        }
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
    init().done(() => {
        gameloopid = requestAnimationFrame(gameloop);
    });
    document.getElementById("game").focus();
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