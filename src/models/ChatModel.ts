import { Instance, types } from 'mobx-state-tree'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'
import { UserModel } from './UserModel'

export interface MessageType extends Instance<typeof Message> {}

const Message = types.model('Message', {
  messageSide: types.union(types.literal('guest'), types.literal('staff')),
  user: UserModel,
  timestamp: types.Date,
  content: types.string
})

export interface UserMessagesType extends Instance<typeof UserMessagesModel> {}
const UserMessagesModel = types.model('User Messages', {
  user: UserModel,
  messages: types.array(Message),
  lastReadTimestamp: types.optional(types.Date, new Date(0))
})

export interface ChatType extends Instance<typeof ChatModel> {}
const ChatModel = types
  .model('Chat', {
    withSelfMessages: types.array(Message),
    // default date to Unix epoch, so everything is "unread" by default
    lastReadTimestamp: types.optional(types.Date, new Date(0)),
    withUsers: types.maybeNull(types.array(UserMessagesModel))
  })
  .views(self => ({
    get displayMessages() {
      function displayTime(timestamp: Date) {
        // triggers a rerender of the entire chat page once a minute
        if (dayjs(timestamp).year() !== dayjs(now(60000)).year())
          return dayjs(timestamp).format('MMM D, YYYY HH:mm')
        if (
          dayjs(now(60000)).subtract(1, 'day').startOf('day').isAfter(timestamp)
        )
          return dayjs(timestamp).format('MMM D HH:mm')
        return dayjs(timestamp).format('HH:mm')
      }

      return self.withSelfMessages.map(message => ({
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
      return self.withSelfMessages.reduce(
        (count, message) =>
          count + (message.timestamp > self.lastReadTimestamp ? 1 : 0),
        0
      )
    }
  }))
  .actions(self => ({
    insertGuestMessage(message: MessageType) {
      self.withSelfMessages.push(message)
      self.lastReadTimestamp = new Date()
    },
    insertStaffMessage(message: MessageType) {
      self.withSelfMessages.push(message)
    }
  }))

export const Chat = types.optional(ChatModel, { withSelfMessages: [] })
