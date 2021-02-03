import { types } from 'mobx-state-tree'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime, {
  // strict thresholds (the default displays 45 minutes+ as an hour 🤷)
  thresholds: [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y' },
    { l: 'yy', d: 'year' }
  ]
})

const MessagePerson = types.model('MessagePerson', {
  personName: types.string,
  imageSrc: types.string
})

const Message = types.model('Message', {
  messageSide: types.union(types.literal('guest'), types.literal('staff')),
  person: MessagePerson,
  timestamp: types.Date,
  content: types.string
})

const ChatModel = types
  .model('Chat', {
    messages: types.array(Message),
    // default date to Unix epoch, so everything is "unread" by default
    lastReadTimestamp: types.optional(types.Date, new Date(null))
  })
  .views(self => ({
    get displayMessages() {
      function displayTime(timestamp) {
        const relativeTime = dayjs(now()).to(timestamp)

        if (dayjs(now()).diff(timestamp, 'minutes') < 45) return relativeTime
        else
          return `${dayjs(timestamp).format(
            'MMM D, YYYY h:mm A'
          )} (${relativeTime})`
      }

      return self.messages.map(message => ({
        ...message,
        timeSignature: displayTime(message.timestamp)
      }))
    }
  }))
  .views(self => ({
    get orderedMessages() {
      return self.displayMessages
        .slice()
        .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
    },
    get unreadCount() {
      return self.messages.reduce(
        (count, message) =>
          count + (message.timestamp > self.lastReadTimestamp ? 1 : 0),
        0
      )
    }
  }))
  .actions(self => ({}))

export const Chat = types.optional(ChatModel, { messages: [] })
