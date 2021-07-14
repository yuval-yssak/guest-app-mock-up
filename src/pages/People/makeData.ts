import { LoremIpsum } from 'lorem-ipsum'
import faker from 'faker'

const lorem = new LoremIpsum({
  wordsPerSentence: {
    max: 4,
    min: 1
  }
})

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  const statusChance = Math.random()
  return {
    headshot: faker.image.avatar(),
    arrivalTime: `${Math.floor(Math.random() * 12)
      .toString()
      .padStart(2, '0')}:${(Math.floor(Math.random() * 12) * 5)
      .toString()
      .padStart(2, '0')}`,
    names: lorem
      .generateSentences(1)
      .slice(0, -1)
      .split(' ')
      .map(n => n[0].toUpperCase() + n.slice(1))
      .join(' '),
    rooms: new Array(Math.floor(Math.random() * 3) + 1)
      .fill(null)
      .map(r => Math.floor(Math.random() * 30))
      .join('\n'),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    status:
      statusChance > 0.66
        ? 'relationship'
        : statusChance > 0.33
        ? 'complicated'
        : 'single'
  }
}

export default function makeData(...lens: number[]) {
  const makeDataLevel: (depth: number) => any = (depth = 0) => {
    const len = lens[depth]
    const aa = range(len)

    const bb = aa.map(d => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
      }
    })

    console.log(bb)
    return bb
  }

  return makeDataLevel(0)
}
