/*
--- Part Two ---

The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.

You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.

Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.

The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.

This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.

Consider the same engine schematic again:

467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..

In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.

What is the sum of all of the gear ratios in your engine schematic?
*/

import fs from 'fs'
import path from 'path'

const filename = path.join(import.meta.dir, 'input.txt')
const file = fs.readFileSync(filename, { encoding: 'utf-8', flag: 'r' }).split('\n')
file.pop()

function isSymbol (file: string[], row: number, col: number) {
  const character = file[row][col]
  if (!isNaN(Number(character))) return false
  if (character === '.') return false
  return true
}

function getAdjacentSymbols (file: string[], row: number, left: number, right: number) {
  const symbols = []
  const boundary = {
    top: 0,
    right: file[row].length - 1,
    bottom: file.length - 1,
    left: 0
  }

  // Check top
  if (row > boundary.top) {
    for (let i = left; i <= right; i++) {
      if (isSymbol(file, row - 1, i)) {
        symbols.push([row - 1, i])
      }
    }
  }

  // Check bottom
  if (row < boundary.bottom) {
    for (let i = left; i <= right; i++) {
      if (isSymbol(file, row + 1, i)) {
        symbols.push([row + 1, i])
      }
    }
  }

  // Check top-right
  if (row > boundary.top && right < boundary.right) {
    if (isSymbol(file, row - 1, right + 1)) {
      symbols.push([row - 1, right + 1])
    }
  }

  // Check right
  if (right < boundary.right) {
    if (isSymbol(file, row, right + 1)) {
      symbols.push([row, right + 1])
    }
  }

  // Check bottom-right
  if (row < boundary.bottom && right < boundary.right) {
    if (isSymbol(file, row + 1, right + 1)) {
      symbols.push([row + 1, right + 1])
    }
  }

  // Check bottom-left
  if (row < boundary.bottom && left > boundary.left) {
    if (isSymbol(file, row + 1, left - 1)) {
      symbols.push([row + 1, left - 1])
    }
  }

  // Check left
  if (left > boundary.left) {
    if (isSymbol(file, row, left - 1)) {
      symbols.push([row, left - 1])
    }
  }

  // Check top-left
  if (row > boundary.top && left > boundary.left) {
    if (isSymbol(file, row - 1, left - 1)) {
      symbols.push([row - 1, left - 1])
    }
  }

  return symbols
}

const allSymbols: Record<string, Set<number>> = {}
let sumOfPartNumbers = 0

for (let row = 0; row < file.length; row++) {
  for (let col = 0; col < file[row].length; col++) {
    if (!isNaN(Number(file[row][col]))) {
      let left = col
      let right = col + 1
      while (right < file[row].length) {
        if (isNaN(Number(file[row][right]))) break
        right++
      }
      right--
      const partNumber = Number(file[row].substring(left, right + 1))
      const adjacentSymbols = getAdjacentSymbols(file, row, left, right)
      for (const adjacentSymbol of adjacentSymbols) {
        const [x, y] = adjacentSymbol
        allSymbols[`${x},${y}`] ??= new Set<number>()
        allSymbols[`${x},${y}`].add(partNumber)
      }
      col = right
    }
  }
}

for (const position of Object.keys(allSymbols)) {
  if (allSymbols[position].size === 2) {
    let values = 1
    for (const value of allSymbols[position].values()) {
      values *= value
    }
    sumOfPartNumbers += values
  }
}

console.log(sumOfPartNumbers)
