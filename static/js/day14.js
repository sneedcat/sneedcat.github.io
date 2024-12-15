const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const WIDTH = 101;
const HEIGHT = 103;
const scale = canvas.width / WIDTH;
const rows = WIDTH;
const cols = HEIGHT;
let count = 0;
let guards = [];

window.addEventListener('load', draw);

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Guard {
    constructor(pos, vel) {
        this.pos = pos;
        this.vel = vel;
    }
}


function readInput() {
    if (guards.length > 0) {
        guards = [];
    }
    const input = document.getElementById('input').value;
    const lines = input.trim().split('\n');
    for (let line of lines) {
        const parts = line.trim().split(' ');
        const pos_str = parts[0].slice(2).split(',');
        const pos = new Point(parseInt(pos_str[0]), parseInt(pos_str[1]));
        const vel_str = parts[1].slice(2).split(',');
        const vel = new Point(parseInt(vel_str[0]), parseInt(vel_str[1]));
        guards.push(new Guard(pos, vel));
    }
}

function simulate() {
    for (let guard of guards) {
        guard.pos.x += guard.vel.x;
        guard.pos.y += guard.vel.y;
        if (guard.pos.x < 0) {
            guard.pos.x += WIDTH;
        }
        if (guard.pos.y < 0) {
            guard.pos.y += HEIGHT;
        }
        if (guard.pos.x >= WIDTH) {
            guard.pos.x -= WIDTH;
        }
        if (guard.pos.y >= HEIGHT) {
            guard.pos.y -= HEIGHT;
        }
    }
}

function simulate_back() {
    for (let guard of guards) {
        guard.pos.x -= guard.vel.x;
        guard.pos.y -= guard.vel.y;
        if (guard.pos.x < 0) {
            guard.pos.x += WIDTH;
        }
        if (guard.pos.y < 0) {
            guard.pos.y += HEIGHT;
        }
        if (guard.pos.x >= WIDTH) {
            guard.pos.x -= WIDTH;
        }
        if (guard.pos.y >= HEIGHT) {
            guard.pos.y -= HEIGHT;
        }
    }
}

function simulate_single_pass() {
    if (guards.length == 0) {
        readInput();
        draw();
    }
    simulate();
    count += 1;
    draw();
}

function simulate_back_single_pass() {
    if (guards.length == 0) {
        readInput();
        draw();
    }
    simulate_back();
    count -= 1;
    draw();
}

function check_tree(x, y) {
    let matrix = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    for (let guard of guards) {
        matrix[guard.pos.y][guard.pos.x] = 1;
    }
    for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH - 15; j++) {
            let count_row = 0;
            for (let k = 0; k < 15; k++) {
                count_row += matrix[i][j + k];
            }
            if (count_row === 15) {
                return true;
            }
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    for (let guard of guards) {
        ctx.fillRect(guard.pos.x * scale, guard.pos.y * scale, scale, scale);
    }
    document.getElementById('solution').innerText = 'Seconds: ' + count;
}

function simulate_until_tree() {
    if (guards.length == 0) {
        readInput();
        draw();
    }
    while(count < 10000) {
        simulate();
        count += 1;
        if (count > 0 && count % 1000 === 0) {
            draw();
        }
        if (check_tree()) {
            break;
        }
    }
    draw();
}

function submit() {
    readInput();
    count = 0;
    draw();
}
