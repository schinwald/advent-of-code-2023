/* 
--- Part Two ---

Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".

Equipped with this new information, you now need to find the real first and last digit on each line. For example:

two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen

In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.

What is the sum of all of the calibration values?
*/

import fs from 'fs'
import path from 'path'

class Trie {
  private root: TrieNode

  constructor () {
    this.root = new TrieNode('*')
  }

  public addWord (word: string, value: string) {
    let current = this.root
    for (let i = 0; i < word.length; i++) {
      current = current.addNode(word[i], (i === word.length - 1) ? value : undefined)
    }
  }

  public getRoot () {
    return this.root
  }
}

class TrieNodeList {
  private current: TrieNode

  constructor (trie: Trie) {
    this.current = trie.getRoot()
  }

  public nextNode (character: string) {
    this.current = this.current.getNode(character)
    return this.current
  }

  public getCurrentValue () {
    return this.current.getValue()
  }
}

class TrieNode {
  private character: string
  private value?: string
  private nodes: Record<string, TrieNode>

  constructor (character: string, value?: string) {
    this.character = character
    if (value) this.value = value
    this.nodes = {}
  }

  public addNode (character: string, value?: string) {
    if (this.nodes[character]) return this.nodes[character]
    this.nodes[character] = new TrieNode(character, value)
    return this.nodes[character]
  }

  public getNode (character: string) {
    return this.nodes[character]
  }

  public getCharacter () {
    return this.character
  }

  public getValue () {
    return this.value
  }

  public getNodes () {
    return this.nodes
  }
}

const forwardTrie = new Trie()

forwardTrie.addWord('zero', '0')
forwardTrie.addWord('one', '1')
forwardTrie.addWord('two', '2')
forwardTrie.addWord('three', '3')
forwardTrie.addWord('four', '4')
forwardTrie.addWord('five', '5')
forwardTrie.addWord('six', '6')
forwardTrie.addWord('seven', '7')
forwardTrie.addWord('eight', '8')
forwardTrie.addWord('nine', '9')
forwardTrie.addWord('0', '0')
forwardTrie.addWord('1', '1')
forwardTrie.addWord('2', '2')
forwardTrie.addWord('3', '3')
forwardTrie.addWord('4', '4')
forwardTrie.addWord('5', '5')
forwardTrie.addWord('6', '6')
forwardTrie.addWord('7', '7')
forwardTrie.addWord('8', '8')
forwardTrie.addWord('9', '9')

const reverseTrie = new Trie()

reverseTrie.addWord('orez', '0')
reverseTrie.addWord('eno', '1')
reverseTrie.addWord('owt', '2')
reverseTrie.addWord('eerht', '3')
reverseTrie.addWord('ruof', '4')
reverseTrie.addWord('evif', '5')
reverseTrie.addWord('xis', '6')
reverseTrie.addWord('neves', '7')
reverseTrie.addWord('thgie', '8')
reverseTrie.addWord('enin', '9')
reverseTrie.addWord('0', '0')
reverseTrie.addWord('1', '1')
reverseTrie.addWord('2', '2')
reverseTrie.addWord('3', '3')
reverseTrie.addWord('4', '4')
reverseTrie.addWord('5', '5')
reverseTrie.addWord('6', '6')
reverseTrie.addWord('7', '7')
reverseTrie.addWord('8', '8')
reverseTrie.addWord('9', '9')

const filename = path.join(import.meta.dir, 'input.txt')
const file = fs.readFileSync(filename, { encoding: 'utf-8', flag: 'r' }).split('\n')

let calibrationSum = 0

for (const line of file) {
  if (line.length === 0) continue

  const forwardTrieNodeLists = new Set<TrieNodeList>()
  const reverseTrieNodeLists = new Set<TrieNodeList>()
  let leftMost, rightMost

  for (let l = 0; l < line.length; l++) {
    forwardTrieNodeLists.add(new TrieNodeList(forwardTrie))
    for (const forwardTrieNodeList of forwardTrieNodeLists) {
      const forwardTrieNode = forwardTrieNodeList.nextNode(line[l])
      if (!forwardTrieNode) {
        forwardTrieNodeLists.delete(forwardTrieNodeList)
        continue
      }

      const value = forwardTrieNode.getValue()
      if (value) {
        leftMost = value
        break
      }
    }

    if (leftMost) break
  }

  for (let r = line.length - 1; r >= 0; r--) {
    reverseTrieNodeLists.add(new TrieNodeList(reverseTrie))
    for (const reverseTrieNodeList of reverseTrieNodeLists) {
      const reverseTrieNode = reverseTrieNodeList.nextNode(line[r])
      if (!reverseTrieNode) {
        reverseTrieNodeLists.delete(reverseTrieNodeList)
        continue
      }

      const value = reverseTrieNode.getValue()
      if (value) {
        rightMost = value
        break
      }
    }

    if (rightMost) break
  }

  const calibration = Number(`${leftMost}${rightMost}`)
  calibrationSum += calibration
}

console.log(calibrationSum)
