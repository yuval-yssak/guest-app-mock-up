import { UserType } from './models/UserModel'
import { RootStoreSnapshotIn } from './models/RootStore'
import { LoremIpsum } from 'lorem-ipsum'
import { MessageCreationType } from './models/ChatModel'
import faker from 'faker'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 8,
    min: 3
  }
})

export const users: UserType[] = (
  [
    {
      id: 1,
      type: 'staff',
      personName: 'Pranava Chaitanya',
      imageSrc: '/images/pranava-chaitanya.jpg'
    },
    {
      id: 2,
      type: 'staff',
      personName: 'Iswara Chaitanya',
      imageSrc: '/images/iswara-chaitanya.jpg'
    },
    {
      id: 3,
      personName: 'Bhargavi',
      imageSrc: '',
      type: 'staff'
    },
    {
      id: 4,
      personName: 'Jenny',
      imageSrc: '/images/photo-1493666438817-866a91353ca9.jpeg',
      type: 'guest'
    }
  ] as UserType[]
).concat(generateUsers(46, 5))

const loggedInUser = 1

const defaultStore: RootStoreSnapshotIn = {
  users,
  loggedInUser,
  chats: {
    withUsers: users
      .filter(user => user.id !== loggedInUser)
      .map(user => {
        const messages = generateRandomMessages(users, user.id, 20)
        const lastReadTimestamp = randomlyChooseLastReadMessageTime(messages)
        return {
          user: user.id,
          chat: {
            messages,
            lastReadTimestamp,
            lastReadTimestampShown: lastReadTimestamp
          }
        }
      }),

    withStaff: (() => {
      const messages = generateRandomMessages(users, loggedInUser, 20)

      const lastReadTimestamp = randomlyChooseLastReadMessageTime(messages)
      return {
        messages,
        lastReadTimestamp,
        lastReadTimestampShown: lastReadTimestamp
      }
    })()
  },
  preferences: { darkMode: false }
}

export function generateUsers(count: number, idOffset: number): UserType[] {
  return Array.from({ length: count }).map<UserType>((_, i) => ({
    id: i + idOffset,
    personName: `${faker.name.firstName()} ${faker.name.lastName()}`,
    imageSrc: Math.random() > 0.8 ? '' : faker.image.avatar(),
    type: 'guest',
    inHouse: true
  }))
}

function randomlyChooseLastReadMessageTime(messages: MessageCreationType[]) {
  return Math.random() > 0.6
    ? messages[Math.floor(Math.random() * messages.length)]?.timestamp
    : undefined
}

export function generateRandomMessages(
  users: UserType[],
  selfUser: number,
  count = 25,
  before: Date = new Date()
): MessageCreationType[] {
  const allowedUsers = users.filter(
    user => user.id === selfUser || user.type === 'staff'
  )
  return new Array(Math.max(1, Math.floor(Math.random() * count)))
    .fill(null)
    .map(() => ({
      content: lorem.generateWords(Math.floor(Math.random() * 50)),
      timestamp: new Date(
        before.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 100)
      ),
      user: allowedUsers[Math.floor(Math.random() * allowedUsers.length)].id
    }))
}

export default defaultStore
