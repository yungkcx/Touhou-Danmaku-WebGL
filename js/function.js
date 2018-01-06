function create_danmaku(title_or_func, shot_func) {
    let obj = {
        title: title_or_func,
        shot: shot_func
    };
    if (arguments.length == 1 && typeof title_or_func == 'function') {
        obj.title = null;
        obj.shot = title_or_func;
        return obj;
    } else if (arguments.length == 2 && typeof title_or_func == 'string') {
        return obj;
    } else {
        console.error("Error: wrong type of the arguments");
        return null;
    }
}

function add_danmaku(start_time, shot_type, bullet_type, bullet_color) {
    return {
        start_time: start_time,
        shot_type: shot_type,
        bullet_type: bullet_type,
        bullet_color: bullet_color
    };
}

function drawline(x1, y1, x2, y2, color = "blue") {
    gl.beginPath();
    gl.moveTo(x1, y1);
    gl.lineTo(x2, y2);
    let ss = gl.strokeStyle;
    gl.strokeStyle = color;
    gl.stroke();
    gl.strokeStyle = ss;
    gl.closePath();
}

function drawImage(img, x, y, angle) {
    gl.save();
    gl.translate(x, y);
    gl.rotate(angle);
    gl.drawImage(img, Math.floor(-img.width / 2), Math.floor(-img.height / 2));
    gl.restore();
}

function se_play() {
    se_bullet.forEach(se => {
        if (se.flag == true) {
            if (se.audio.currentTime > 0) {
                se.audio.currentTime = 0;
            }
            se.audio.play();
        }
    });
}

function count_fps(now) {
    if (now - last_time >= 500) { // Count FPS per second.
        fps = (stage_count - last_count) / (now - last_time) * 1000;
        last_count = stage_count;
        last_time = now;
        let text = fps.toFixed(2) + " fps";
        text_ctx.clearRect(0, 0, text_canvas.width, text_canvas.height);
        text_ctx.fillText(text, 0, 15);
    }
}

function range(angle) {
    return (-angle + angle * 2 * Math.random());
}

function getrand(max) {
    return Math.floor(Math.random() * max);
}