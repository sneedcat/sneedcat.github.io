---
date: '2024-12-15T23:22:22+02:00'
title: 'Interactive Day 14'
tags: ['Advent of Code', 'Interactive', 'Coding', '2024', 'Simulation']
---

This is an interactive simulation for day 14 of Advent of Code 2024.

You have to input the initial positions of the guards and their velocities (You can get them from [AOC](https://adventofcode.com/2024/day/14)). The simulation will run until a tree is formed. The tree is formed when there are 15 guards in a row.

The simulation function is just
```js
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
```

and the function to check if the tree is formed is
```js
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
```

There could have been a better way to check if the tree is formed but this is the simplest way to do it. I've seen solutions where people check for the lowest entropy of the resulting image, but that's too complicated for this.

Use `Submit` to submit the input or reset the simulation, `Simulate` to simulate one second, `Simulate back` to simulate one second back, and `Simulate until tree` to simulate until the tree is formed.

{{< day14 >}}