import dayjs from 'dayjs'
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

export const users: UserType[] = ([
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
] as UserType[]).concat(generateUsers(46, 5))

const loggedInUser = 1

function generateStats() {
  return {
    readStatistics: users
      .filter((_, i) => i < Math.random() * users.length)
      .map(u => ({
        readBy: u.id,
        timestamp: new Date(
          Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 2
        )
      }))
  }
}

const defaultStore: RootStoreSnapshotIn = {
  users,
  loggedInUser,
  announcements: {
    active: [
      {
        id: '2',
        status: 'unread',
        priority: 'low',
        summary:
          'Odit dolores provident sed perferendis blanditiis maiores neque.',
        details:
          'Omnis similique fuga sequi quam labore, voluptate unde iure asperiores. Laborum, tenetur soluta ad possimus inventore quas consequuntur, sequi earum velit omnis repellat eligendi exercitationem sint, numquam sunt rem ipsam? Nobis repudiandae repellendus totam fugiat nulla a consectetur veniam optio?',
        publishOn: dayjs().subtract(4, 'hours').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: {
          stats: { readStatistics: [] }
        }
      },
      {
        id: '3',
        status: 'unread',
        priority: 'high',
        summary: 'Ex earum eaque vel rem eos, dolorem officiis.',
        details:
          'Sint vitae, repudiandae dicta cum non, dolorem a, quaerat eum vero labore ipsam nulla similique maiores omnis at expedita vel quasi dolores sequi consequatur deserunt. Alias aut molestiae, fugit ad voluptate voluptatem sed, nam quasi corrupti, tempore sit temporibus doloribus.',
        publishOn: dayjs().subtract(4, 'minutes').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '1',
        status: 'read',
        priority: 'low',
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        details:
          'Rem culpa, labore dolores et nobis quod deserunt error ad pariatur sunt quasi praesentium officia reprehenderit odit eius numquam quo temporibus repellat voluptatibus placeat doloribus architecto. Repellat, illum sint enim ipsum laboriosam qui maiores repudiandae quas vero accusamus! Fugiat nesciunt minima consequuntur, optio in veritatis sapiente nisi totam autem eaque!',
        publishOn: dayjs().subtract(4, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '4',
        status: 'read',
        priority: 'low',
        summary: 'Ad quos dolores quam?',
        details:
          'Inventore aperiam ipsam dolorem quia reiciendis, quam quasi illo ab doloribus perspiciatis quisquam aliquam sit sed eos nulla quod nostrum!',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '5',
        status: 'read',
        priority: 'high',
        summary: 'Distinctio reiciendis natus ea?',
        details:
          'Illo, provident dolores! Dolores saepe voluptatibus fugit, vel unde doloribus cumque reprehenderit quidem ipsum recusandae eveniet possimus tempora consequuntur. Vitae.',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '6',
        status: 'unread',
        priority: 'high',
        summary: 'Modi at ipsam eaque?',
        details:
          'Alias laboriosam incidunt dolorem dolorum, praesentium ullam est at culpa doloribus dignissimos ipsa atque? Reiciendis voluptatem dolore cumque incidunt ullam.',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '7',
        status: 'read',
        priority: 'low',
        summary: 'Qui facilis accusamus magni.',
        details:
          'Explicabo exercitationem cum voluptates dolor iste autem magni quod molestiae, mollitia ratione nihil obcaecati? Repellendus quidem facilis perspiciatis eum sapiente.',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '8',
        status: 'unread',
        priority: 'low',
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
        details:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti quidem ipsum culpa ullam, eius sapiente ratione ad quasi sint saepe quisquam! Libero asperiores magnam sunt adipisci, recusandae, nemo nihil ad et, corporis accusamus qui officiis natus harum voluptatibus? Similique, pariatur.',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate(),
        admin: { stats: generateStats() }
      },
      {
        id: '9',
        status: 'read',
        priority: 'low',
        summary: 'Nam corrupti consectetur, explicabo fuga libero aperiam?',
        details:
          'Amet rem dolores, magni dolorem optio, illum veniam placeat nesciunt, laborum blanditiis omnis. Sunt nisi incidunt praesentium perspiciatis ea ratione porro eum quae voluptates repellat, illum dolore natus soluta consequatur obcaecati ducimus nobis hic nihil quod tempora animi fuga cum?',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate()
      },
      {
        id: '10',
        status: 'unread',
        priority: 'low',
        summary: 'Quidem exercitationem numquam rerum nemo maxime ab.',
        details:
          'Dolor earum a fuga id pariatur aliquam? Earum neque corrupti dicta, molestiae eos iure suscipit aspernatur, error rem minus similique harum qui obcaecati perspiciatis maiores saepe? Maiores veniam rem laboriosam doloribus repudiandae? Repellendus odio possimus architecto nostrum debitis tempora itaque!',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate()
      },
      {
        id: '11',
        status: 'read',
        priority: 'low',
        summary: 'Error dolorem, tempore voluptas harum minima hic!',
        details:
          'Illum ipsa delectus consequuntur temporibus sunt est dolores illo rem quaerat maxime commodi doloribus adipisci magni perferendis optio deleniti animi, non, ad distinctio dolore magnam ipsum? Porro dignissimos magnam alias tenetur eius ullam, reiciendis accusantium minus eum! Velit, quidem quis!',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate()
      },
      {
        id: '12',
        status: 'read',
        priority: 'low',
        summary: 'Voluptatibus, blanditiis modi. Numquam odit esse quo!',
        details:
          'Molestiae ipsa nostrum fuga! Distinctio voluptatem optio fugiat? Non error impedit ea, sapiente laborum quaerat? Id adipisci, quo dignissimos fugiat earum voluptates dolor facilis, expedita autem nemo itaque dicta qui odio. Error pariatur dolorem, voluptatibus distinctio illum quo officiis expedita?',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate()
      },
      {
        id: '13',
        status: 'read',
        priority: 'low',
        summary: 'Facilis perferendis animi accusantium ullam alias nostrum.',
        details:
          'Autem necessitatibus voluptatum beatae fuga odio fugiat harum, odit rem similique esse ipsum, dolorem magnam ducimus soluta. Perferendis est provident error magni, cumque amet velit. Eligendi est atque saepe, odio et veritatis, placeat minima ratione animi reiciendis excepturi explicabo modi!',
        publishOn: dayjs().subtract(2, 'days').toDate(),
        publishEnd: dayjs().add(1, 'week').toDate()
      }
    ]
  },
  chats: {
    withUsers: users
      .filter(user => user.id !== loggedInUser)
      .map(user => {
        const messages = generateRandomMessages(users, user.id, 20)

        return {
          user: user.id,
          chat: {
            messages,
            lastReadTimestamp: randomlyChooseLastReadMessageTime(messages)
          }
        }
      }),

    withSelf: (() => {
      const messages = generateRandomMessages(users, loggedInUser, 20)

      return {
        messages,
        lastReadTimestamp: randomlyChooseLastReadMessageTime(messages)
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
