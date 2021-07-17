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

type Person2 = {
  headshot: string
  arrivalTime: string
  name: string
  rooms: string
  balance: number
  comments: string
  signedForms: boolean
  firstTime: boolean
  nights: number
  preferredContactMethod: string
  appUser: boolean
  credit: boolean
}

const newPerson: () => Person2 = () => {
  return {
    headshot: faker.image.avatar(),
    arrivalTime: `${Math.floor(Math.random() * 12)
      .toString()
      .padStart(2, '0')}:${(Math.floor(Math.random() * 12) * 5)
      .toString()
      .padStart(2, '0')}`,
    name: lorem
      .generateSentences(1)
      .slice(0, -1)
      .split(' ')
      .map(n => n[0].toUpperCase() + n.slice(1))
      .join(' '),
    rooms: new Array(Math.floor(Math.random() * 3) + 1)
      .fill(null)
      .map(r => Math.floor(Math.random() * 30))
      .join(', '),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    appUser: Math.random() > 0.5,
    balance: Math.random() > 0.5 ? Math.floor(Math.random() * 200) * 5 : 0,
    comments: lorem.generateSentences(1),
    credit: false,
    firstTime: Math.random() > 0.5,
    nights: Math.floor(Math.random() * 14) + 1,
    preferredContactMethod: 'App',
    signedForms: Math.random() > 0.7
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
