/*
--- Day 3: Gear Ratios ---

You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.

It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.

"Aaah!"

You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.

The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine schematic, it should be easy to work out which part is missing.

The engine schematic (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)

Here is an example engine schematic:

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

In this schematic, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.

Of course, the actual engine schematic is much larger. What is the sum of all of the part numbers in the engine schematic?
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

function isAdjacentToSymbol (file: string[], row: number, col: number) {
  const boundary = {
    top: 0,
    right: file[row].length - 1,
    bottom: file.length - 1,
    left: 0
  }

  // Check top
  if (row > boundary.top && isSymbol(file, row - 1, col)) return true
  // Check top-right
  if (row > boundary.top && col < boundary.right && isSymbol(file, row - 1, col + 1)) return true
  // Check right
  if (col < boundary.right && isSymbol(file, row, col + 1)) return true
  // Check bottom-right
  if (row < boundary.bottom && col < boundary.right && isSymbol(file, row + 1, col + 1)) return true
  // Check bottom
  if (row < boundary.bottom && isSymbol(file, row + 1, col)) return true
  // Check bottom-left
  if (row < boundary.bottom && col > boundary.left && isSymbol(file, row + 1, col - 1)) return true
  // Check left
  if (col > boundary.left && isSymbol(file, row, col - 1)) return true
  // Check top-left
  if (row > boundary.top && col > boundary.left && isSymbol(file, row - 1, col - 1)) return true

  return false
}

function grabNumberLocations (file: string[], row: number, col: number) {
  let left = col, right = col

  left--
  while (left >= 0 && !isNaN(Number(file[row][left]))) {
    left--
  }

  right++
  while (right <= file[row].length - 1 && !isNaN(Number(file[row][right]))) {
    right++
  }

  return [left + 1, right - 1]
}

let sumOfPartNumbers = 0

for (let row = 0; row < file.length; row++) {
  for (let col = 0; col < file[row].length; col++) {
    if (!isNaN(Number(file[row][col])) && isAdjacentToSymbol(file, row, col)) {
      console.log(row, col)
      const [left, right] = grabNumberLocations(file, row, col)
      const partNumber = Number(file[row].substring(left, right + 1))
      col = right
      console.log(partNumber)
      sumOfPartNumbers += partNumber
    }
  }
}

console.log(sumOfPartNumbers)
