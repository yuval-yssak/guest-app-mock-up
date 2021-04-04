import { types } from 'mobx-state-tree'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'

const MessagePerson = types.model('MessagePerson', {
  id: types.identifier,
  personName: types.string,
  imageSrc: types.string
})

const Message = types.model('Message', {
  messageSide: types.union(types.literal('guest'), types.literal('staff')),
  person: MessagePerson, // todo: should be a reference to person model
  timestamp: types.Date,
  content: types.string
})

const ChatModel = types
  .model('Chat', {
    messages: types.array(Message),
    // default date to Unix epoch, so everything is "unread" by default
    lastReadTimestamp: types.optional(types.Date, new Date(null)),
    usersMessages: types.maybeNull(
      types.array(
        types.model('User Messages', {
          person: MessagePerson,
          messages: types.array(Message),
          lastReadTimestamp: types.optional(types.Date, new Date(null))
        })
      )
    )
  })
  .views(self => ({
    get displayMessages() {
      function displayTime(timestamp) {
        // triggers a rerender of the entire chat page once a minute
        if (dayjs(timestamp).year() !== dayjs(now(60000)).year())
          return dayjs(timestamp).format('MMM D, YYYY HH:mm')
        if (
          dayjs(now(60000)).subtract(1, 'day').startOf('day').isAfter(timestamp)
        )
          return dayjs(timestamp).format('MMM D HH:mm')
        return dayjs(timestamp).format('HH:mm')
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
  .actions(self => ({
    insertGuestMessage(message) {
      self.messages.push(message)
      self.lastReadTimestamp = new Date()
    },
    insertStaffMessage(message) {
      self.messages.push(message)
    }
  }))

export const Chat = types.optional(ChatModel, { messages: [] })
