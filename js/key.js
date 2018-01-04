let keystate = [false, false, false, false, false, false];

function handlekey(type) {
    let bool = type == "down" ? true : false;
    return (event) => {
        switch (event.keyCode) {
            case 90: // Z
                keystate[KEY_SHOT] = bool;
                break;
            case 37: // LEFT
                keystate[KEY_LEFT] = bool;
                break;
            case 38: // UP
                keystate[KEY_UP] = bool;
                break;
            case 39: // RIGHT
                keystate[KEY_RIGHT] = bool;
                break;
            case 40: // DOWN
                keystate[KEY_DOWN] = bool;
                break;
            case 16: // SHIFT
                keystate[KEY_SLOW] = bool;
                break;
            default:
                break;
        }
    }
}

function iskeypressed(key) {
    if (key >= 0 && key < keystate.length) {
        return keystate[key];
    }
    return false;
}