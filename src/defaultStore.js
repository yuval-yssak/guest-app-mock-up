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
    unread: [
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
      }
    ],
    read: [
      {
        id: '1',
        status: 'read',
        summary: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        details:
          'Rem culpa, labore dolores et nobis quod deserunt error ad pariatur sunt quasi praesentium officia reprehenderit odit eius numquam quo temporibus repellat voluptatibus placeat doloribus architecto. Repellat, illum sint enim ipsum laboriosam qui maiores repudiandae quas vero accusamus! Fugiat nesciunt minima consequuntur, optio in veritatis sapiente nisi totam autem eaque!',
        timestamp: dayjs().subtract(4, 'days').toDate()
      }
    ]
  },
  chat: {
    messages: [
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
