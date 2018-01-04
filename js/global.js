const FMX = 500; // FIELD_MAX_X
const FMY = 550; // FIELD_MAX_Y
const MAX_SHOT = 10;
const MAX_SHOT_BULLET = 1000;
const BOSS_POS_X = FMX / 2;
const BOSS_POS_Y = FMY * 1 / 4;

const KEY_SHOT = 0;
const KEY_LEFT = 1;
const KEY_UP = 2;
const KEY_RIGHT = 3;
const KEY_DOWN = 4;
const KEY_SLOW = 5;
const PI = 3.1415926535897932385;
const PI2 = PI * 2;

let img_bullet = [];
let img_boss = [];
let img_player = [];
let se_bullet = [];
let shot = [];
let stage_count = 0; // FPS count.
let last_count = 0;
let last_time = 0;
let fps = 0;
let boss = null; // Current boss.
let player = null; // Current player.
let total_bullet = 0; // Total number of bullets on the screen.