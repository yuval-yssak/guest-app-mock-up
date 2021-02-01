import dayjs from 'dayjs'

const defaultStore = {
  view: { page: '/' },
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
  }
}

export default defaultStore
