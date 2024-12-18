---
date: '2024-12-15T23:22:22+02:00'
title: 'Part 2 of Day 17'
tags: ['Advent of Code', 'Coding', '2024', 'Explanation']
---

## Introduction

The part one of this was pretty straightforward. It was a pretty basic interpreter for a language with few instructions and only 3 registers, but part 2 was way more "fun" because it required to find an input (for register A) for which the program will output the same thing as the program itself. It's pretty obvious that you can't make a general solution to this problem because jumps can introduce cycles and also it's not even guaranteed that the program will halt. 

## Interpretation

But if you look closely to the input that you're given, it has some pretty interesting details. For example, this is my input `{2, 4, 1, 5, 7, 5, 4, 3, 1, 6, 0, 3, 5, 5, 3, 0}`. If you look at the codes, the program does:
- `bst` with register `A`
- `bxl` with literal `5`
- `cdv` with  `B`
- `bxc`
- `bxl` with literal `6`
- `adv` with literal `3`
- `out` with register `B`
- `jnz` to `pc: 0`

In code, this will mean something like:
```cpp
size_t a = i;
size_t b = (a & 7) ^ 5;
size_t c = a / (1 << b);
b = (b ^ c) ^ 6;
printf("%lld,", b);
a = a / 8;
```

I've seen other inputs (from other users) and they followed the same patterns I'll explain down here.

Looking closely at the input:
- at any step `i`, the register `B` depends only on the register `A` modulo 8 from the previous step, so only the 3 least significant bits of `A` matter at each step
- at any step `i`, the register `C` depends only on the register `B` at that step, which is always reset
- register `A` is divided by 8 at each step
- we always output the value of register `B` `modulo 8`
- because the input is 16 bytes long, the program needs to halt after exactly 16 steps

Considering these observations, we can conclude that `A` is a number written with 48 bits which can be split in groups of 3 bits. Because we only care about the value of `A` modulo 8 at any step, we can create the number `A` in reverse. At each step, we're adding a value modulo 8, in such a way that the value of `B` modulo 8 is that value in the program. If we have a value of `A` that satifies for `i` conditions, to get the next value we need only to check the values between `A * 8` and `A * 8 + 7` and this way will get the next value of `A` that satisfies for `i + 1` conditions.

The main takeway from this is that we only need to care about the last 3 bits of `A` at any step and we can find the next value of `A` that satisfies the next condition by checking the values between `A * 8` and `A * 8 + 7`.

### Program

A quick program that does this in C++ is:
```cpp
#include <iostream>
#include <vector>
#include <queue>

struct Entry {
    size_t a;
    size_t steps;
    Entry(size_t a, size_t steps) : a(a), steps(steps) {}
    bool operator<(const Entry& other) const {
        if (steps != other.steps)
            return steps > other.steps;
        else
            return a > other.a;
    }
};

int main() {
    std::vector<size_t> program = {2, 4, 1, 5, 7, 5, 4, 3, 1, 6, 0, 3, 5, 5, 3, 0};

    std::priority_queue<Entry> entries;
    for (int i = 0; i < 8; ++i) {
        size_t a = i;
        size_t b = (a & 7) ^ 5;
        size_t c = a / (1 << b);
        b = (b ^ c) ^ 6;
        if ((b & 7) == program[program.size() - 1]) {
            entries.push(Entry(i, 1));
        }
    }

    while (entries.size() != 0) {
        Entry head = entries.top();
        entries.pop();
        if (head.steps == program.size()) {
          std::cout << head.a << '\n';
          break;
        }
        size_t pc = program.size() - head.steps - 1;
        for (size_t i = head.a * 8; i < (head.a + 1) * 8; ++i) {
            size_t a = i;
            size_t b = (a & 7) ^ 5;
            size_t c = a / (1 << b);
            b = (b ^ c) ^ 6;
            if ((b & 7) == program[pc]) {
              entries.push(Entry(i, head.steps + 1));
            }
        }
    }
    return 0;
}
```

### Explanation

The first loop is used to find the initial values of `A` that satisfy the last condition of the program. This values are added to the priority queue. The second loop is used to find the next values of `A` that satisfy the next conditions of the program. The program will stop when it finds a value of `A` that satisfies all the conditions of the program.

The reason why this is using a priority queue is that there are multiple inputs that satisfy this condition and we need to find the smallest one. The priority queue is sorted by steps at first and then by the number. That's one of the reasons why we can't make a general solution for this problem.

I've seen some solutions using `z3` or other solvers, but I think this is the most straightforward way to solve this problem. While I can appreciate the elegance of using a solver, I think that this problem is simple enough to be solved without one and it's also faster to implement this way.

## Conclusion

This was a fun day which kinda made me surprised after the first part. Problems that require you to look closely to the input and make some observations are always fun to solve and are common during the last days of Advent of Code.

I hope you enjoyed this explanation and I hope you'll join me in the next days. Have a great day!