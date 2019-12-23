let x: [string, number]
x = ['h', 2]

console.log(x[0].substr(0, 1))

enum Color {
  Red,
  Green,
  Blue
}

let c: Color = Color.Blue

let u: undefined = null

declare function creat(o: object | null): void

creat({ prop: 'a' })

let someVal: any = 'this is a string'
let strLen: number = (someVal as string).length

let arr = [1, 2]
let [first, second] = arr

let o = {
  a: 1,
  b: 2,
  c: 3
}
let { a: newNameA, b: newNameB }: { a: number; b: number } = o

interface Square {
  color: string
  area: number
}

interface SquareConfig {
  readonly color?: string
  width?: number
  [key: string]: any
}

function createSquare(config: SquareConfig): Square {
  let newSquare = {
    color: 'white',
    area: 100
  }
  if (config.color) {
    newSquare.color = config.color
  }
  if (config.width) {
    newSquare.area = config.width * config.width
  }
  return newSquare
}

let mySquare = createSquare({ color: 'red', width: 20 })

interface SearchFunc {
  (source: string, subStr: string): boolean
}
let mySearch: SearchFunc

mySearch = function(source, subStr) {
  return false
}

interface Card {
  suit: string
  card: number
}

interface Deck {
  suits: string[]
  cards: number[]
  createCardPicker(this: Deck): () => Card
}

let deck: Deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  createCardPicker(this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let picledSuit = Math.floor(pickedCard / 13)

      return {
        suit: this.suits[picledSuit],
        card: pickedCard % 13
      }
    }
  }
}


function identity<T>(arg:T[]): T[] {
  return arg
}

let output = identity(['abc'])
