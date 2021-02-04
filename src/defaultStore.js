import dayjs from 'dayjs'

const staff1 = {
  personName: 'Pranava Chaitanya',
  imageSrc: './images/pranava-chaitanya.jpg'
}

const loggedInUser = {
  personName: 'Richard Barrett',
  imageSrc: './images/32.jpg'
}

const defaultStore = {
  view: { page: '/' },
  loggedInUser,
  announcements: {
    all: [
      {
        id: '2',
        status: 'unread',
        summary:
          'Odit dolores provident sed perferendis blanditiis maiores neque.',
        details:
          'Omnis similique fuga sequi quam labore, voluptate unde iure asperiores. Laborum, tenetur soluta ad possimus inventore quas consequuntur, sequi earum velit omnis repellat eligendi exercitationem sint, numquam sunt rem ipsam? Nobis repudiandae repellendus totam fugiat nulla a consectetur veniam optio?',
        timestamp: dayjs().subtract(4, 'hours').toDate()
      },
      {
        id: '3',
        status: 'unread',
        summary: 'Ex earum eaque vel rem eos, dolorem officiis.',
        details:
          'Sint vitae, repudiandae dicta cum non, dolorem a, quaerat eum vero labore ipsam nulla similique maiores omnis at expedita vel quasi dolores sequi consequatur deserunt. Alias aut molestiae, fugit ad voluptate voluptatem sed, nam quasi corrupti, tempore sit temporibus doloribus.',
        timestamp: dayjs().subtract(4, 'minutes').toDate()
      },
      {
        id: '1',
        status: 'read',
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        details:
          'Rem culpa, labore dolores et nobis quod deserunt error ad pariatur sunt quasi praesentium officia reprehenderit odit eius numquam quo temporibus repellat voluptatibus placeat doloribus architecto. Repellat, illum sint enim ipsum laboriosam qui maiores repudiandae quas vero accusamus! Fugiat nesciunt minima consequuntur, optio in veritatis sapiente nisi totam autem eaque!',
        timestamp: dayjs().subtract(4, 'days').toDate()
      },
      {
        id: '4',
        status: 'read',
        summary: 'Ad quos dolores quam?',
        details:
          'Inventore aperiam ipsam dolorem quia reiciendis, quam quasi illo ab doloribus perspiciatis quisquam aliquam sit sed eos nulla quod nostrum!',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '5',
        status: 'read',
        summary: 'Distinctio reiciendis natus ea?',
        details:
          'Illo, provident dolores! Dolores saepe voluptatibus fugit, vel unde doloribus cumque reprehenderit quidem ipsum recusandae eveniet possimus tempora consequuntur. Vitae.',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '6',
        status: 'unread',
        summary: 'Modi at ipsam eaque?',
        details:
          'Alias laboriosam incidunt dolorem dolorum, praesentium ullam est at culpa doloribus dignissimos ipsa atque? Reiciendis voluptatem dolore cumque incidunt ullam.',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '7',
        status: 'read',
        summary: 'Qui facilis accusamus magni.',
        details:
          'Explicabo exercitationem cum voluptates dolor iste autem magni quod molestiae, mollitia ratione nihil obcaecati? Repellendus quidem facilis perspiciatis eum sapiente.',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '8',
        status: 'unread',
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing.',
        details:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti quidem ipsum culpa ullam, eius sapiente ratione ad quasi sint saepe quisquam! Libero asperiores magnam sunt adipisci, recusandae, nemo nihil ad et, corporis accusamus qui officiis natus harum voluptatibus? Similique, pariatur.',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '9',
        status: 'read',
        summary: 'Nam corrupti consectetur, explicabo fuga libero aperiam?',
        details:
          'Amet rem dolores, magni dolorem optio, illum veniam placeat nesciunt, laborum blanditiis omnis. Sunt nisi incidunt praesentium perspiciatis ea ratione porro eum quae voluptates repellat, illum dolore natus soluta consequatur obcaecati ducimus nobis hic nihil quod tempora animi fuga cum?',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '10',
        status: 'unread',
        summary: 'Quidem exercitationem numquam rerum nemo maxime ab.',
        details:
          'Dolor earum a fuga id pariatur aliquam? Earum neque corrupti dicta, molestiae eos iure suscipit aspernatur, error rem minus similique harum qui obcaecati perspiciatis maiores saepe? Maiores veniam rem laboriosam doloribus repudiandae? Repellendus odio possimus architecto nostrum debitis tempora itaque!',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '11',
        status: 'read',
        summary: 'Error dolorem, tempore voluptas harum minima hic!',
        details:
          'Illum ipsa delectus consequuntur temporibus sunt est dolores illo rem quaerat maxime commodi doloribus adipisci magni perferendis optio deleniti animi, non, ad distinctio dolore magnam ipsum? Porro dignissimos magnam alias tenetur eius ullam, reiciendis accusantium minus eum! Velit, quidem quis!',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '12',
        status: 'read',
        summary: 'Voluptatibus, blanditiis modi. Numquam odit esse quo!',
        details:
          'Molestiae ipsa nostrum fuga! Distinctio voluptatem optio fugiat? Non error impedit ea, sapiente laborum quaerat? Id adipisci, quo dignissimos fugiat earum voluptates dolor facilis, expedita autem nemo itaque dicta qui odio. Error pariatur dolorem, voluptatibus distinctio illum quo officiis expedita?',
        timestamp: dayjs().subtract(2, 'days').toDate()
      },
      {
        id: '13',
        status: 'read',
        summary: 'Facilis perferendis animi accusantium ullam alias nostrum.',
        details:
          'Autem necessitatibus voluptatum beatae fuga odio fugiat harum, odit rem similique esse ipsum, dolorem magnam ducimus soluta. Perferendis est provident error magni, cumque amet velit. Eligendi est atque saepe, odio et veritatis, placeat minima ratione animi reiciendis excepturi explicabo modi!',
        timestamp: dayjs().subtract(2, 'days').toDate()
      }
    ]
  },
  chat: {
    messages: [
      {
        messageSide: 'staff',
        person: loggedInUser,
        timestamp: dayjs()
          .subtract(2, 'years')
          .add(8, 'months')
          .add(3, 'days')
          .toDate(),
        content: 'Impedit aperiam labore aspernatur!'
      },
      {
        messageSide: 'staff',
        person: loggedInUser,
        timestamp: dayjs().subtract(2, 'weeks').toDate(),
        content:
          'Perspiciatis ipsa repellendus, numquam temporibus vitae amet dolorum! A cupiditate voluptas quasi laboriosam!'
      },
      {
        messageSide: 'guest',
        person: loggedInUser,
        timestamp: dayjs().subtract(3, 'days').toDate(),
        content:
          'Aut fugiat voluptate alias porro dolor sunt placeat! Incidunt hic odit quo'
      },
      {
        messageSide: 'staff',
        person: loggedInUser,
        timestamp: dayjs().subtract(2, 'days').toDate(),
        content: 'Optio accusantium quisquam omnis, assumenda esse'
      },
      {
        messageSide: 'guest',
        person: loggedInUser,
        timestamp: dayjs().subtract(1, 'day').toDate(),
        content: 'Veritatis, aut corporis.'
      },
      {
        messageSide: 'staff',
        person: staff1,
        timestamp: dayjs().subtract(10, 'hours').minute(5).second(30).toDate(),
        content: 'Lorem ipsum dolor sit'
      },
      {
        messageSide: 'guest',
        person: loggedInUser,
        timestamp: dayjs().subtract(10, 'hours').minute(6).second(3).toDate(),
        content:
          'Inventore vitae doloremque consectetur incidunt fugiat dolore nemo pariatur ut harum dolorem eveniet non officiis voluptatum qui, temporibus quaerat accusamus blanditiis expedita perferendis eum tempora dolor animi labore! Ad reiciendis voluptas similique quo magnam nostrum quis corporis eius facere est debitis mollitia alias, ex reprehenderit dicta vitae, amet numquam repellendus iste. Rem minima itaque non, autem necessitatibus veniam recusandae deserunt fugit, excepturi est debitis quas omnis accusantium tenetur amet illum maxime quaerat consequatur? Similique esse natus eligendi dolorem id! Harum!'
      },
      {
        messageSide: 'staff',
        person: staff1,
        timestamp: dayjs().subtract(8, 'hours').minute(5).second(30).toDate(),
        content:
          'Ratione, officia voluptates adipisci quis vero debitis! Illo, temporibus facere saepe officia voluptatum soluta dolor enim nesciunt aliquam exercitationem. Eum saepe adipisci nemo vero ipsum totam minima deleniti exercitationem, nam eveniet debitis voluptates corporis officia. Amet at dolorum sapiente, nostrum doloribus sint tempore quisquam molestiae.'
      },
      {
        messageSide: 'staff',
        person: { personName: 'Bhargavi', imageSrc: '' },
        timestamp: dayjs().subtract(44, 'minutes').toDate(),
        content:
          'Necessitatibus iste officia nostrum ipsa amet vitae natus debitis sapiente in, incidunt illum reiciendis adipisci at consequuntur fugit nulla iure a ratione! Earum consequuntur molestias asperiores iusto voluptatibus rerum in.'
      }
    ],
    lastReadTimestamp: dayjs().subtract(9, 'hours').toDate()
  }
}

export default defaultStore
