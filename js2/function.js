function create_danmaku(title_or_func, shot_func) {
    let obj = {
        title: title_or_func,
        shot: shot_func
    };
    if (arguments.length == 1 && typeof title_or_func == "function") {
        obj.title = null;
        obj.shot = title_or_func;
        return obj;
    } else if (arguments.length == 2 && typeof title_or_func == "string") {
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

function drawImage(img, x, y, angle, width = img.width, height = img.height) {
    gl.save();
    gl.translate(x, y);
    gl.rotate(angle);
    gl.drawImage(img, Math.floor(-width / 2), Math.floor(-height / 2), width, height);
    gl.restore();
}

function drawLaser(img, startX, startY, width, height, angle) {
    gl.save();
    gl.translate(startX, startY);
    gl.rotate(angle);
    gl.drawImage(img, -width / 2, 0, Math.floor(width), Math.floor(height));
    gl.restore();
}

function se_reset() {
    se_bullet.forEach(se => {
        se.flag = false;
    });
}

function se_play() {
    se_bullet.forEach(se => {
        if (se.flag == true) {
            if (se.audio.currentTime > 0) {
                // se.audio.currentTime = 0;
                // se.audio.fastSeek(0);
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

function count_total_bullet() {
    if (total_bullet > pre_total_bullet) {
        // console.log("total bullet =", total_bullet);
        document.getElementById("total-bullet").innerHTML = total_bullet;
        pre_total_bullet = total_bullet;
    }
}

function range(angle) {
    return (-angle + angle * 2 * Math.random());
}

function getrand(max) {
    return Math.floor(Math.random() * max);
}

function rand_array(n, layer = 1) {
    let arr = [];
    let retarr = [];
    let layerlen = Math.ceil(n / layer);
    for (let j = 0; j < layer; j++) {
        let tmparr = [];
        let tmplen;
        if (n - arr.length < layerlen) {
            tmplen = n - arr.length;
        } else {
            tmplen = Math.ceil(n / layer);
        }
        for (let i = 0; i < tmplen; i++) {
            tmparr.push(j + layer * i);
        }
        for (let i = tmplen - 1; i > 0; i--) {
            let t = Math.floor(Math.random() * (i + 1));
            let item = tmparr[t];
            tmparr[t] = tmparr[i];
            tmparr[i] = item;
        }
        arr.push(tmparr);
    }
    for (let i = arr.length - 1; i > 0; i--) {
        let t = Math.floor(Math.random() * (i + 1));
        let item = arr[t];
        arr[t] = arr[i];
        arr[i] = item;
    }
    arr.forEach(a => {
        retarr = retarr.concat(a);
    });
    return retarr;
}

// Return the angle between the boss and player.
function bossatan() {
    return Math.atan2(player.y - boss.y, player.x - boss.x);
}

// Return the angle between the bullet and (x, y).
function bulletatan(b, x, y) {
    return Math.atan2(y - b.y, x - b.x);
}

// Return the angle between the bullet and the player.
function bulletatanpl(b) {
    return Math.atan2(player.y - b.y, player.x - b.x);
}