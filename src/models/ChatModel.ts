import { Instance, types, getRoot, SnapshotIn } from 'mobx-state-tree'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'
import { UserModel } from './UserModel'

const MessageModel = types
  .model('MessageModel', {
    user: UserModel,
    timestamp: types.Date,
    content: types.string
  })
  .views(self => ({
    get messageSide() {
      console.log(
        'determining sides',
        self.user.id,
        (getRoot(self) as any).loggedInUser.id
      )
      return (getRoot(self) as any).loggedInUser.id === self.user.id
        ? 'self'
        : 'other'
    },
    get timeSignature() {
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

      return displayTime(self.timestamp)
    }
  }))

const ChatModel = types
  .model('ChatModel', {
    // default date to Unix epoch, so everything is "unread" by default
    lastReadTimestamp: types.optional(types.Date, new Date(0)),
    messages: types.array(MessageModel)
  })
  .views(self => ({
    get orderedMessages() {
      return self.messages
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
    insertGuestMessage(message: MessageCreationType) {
      self.messages.push(message)
      self.lastReadTimestamp = new Date()
    },
    insertStaffMessage(message: MessageCreationType) {
      self.messages.push(message)
    }
  }))

const UserChatModel = types.model('UserChatModel', {
  user: UserModel,
  chat: ChatModel
})

export const ChatsModel = types.model('ChatsModel', {
  withSelf: ChatModel,
  withUsers: types.maybeNull(types.array(UserChatModel))
})

export interface UserChatType extends Instance<typeof UserChatModel> {}
export interface ChatType extends Instance<typeof ChatModel> {}
export interface MessageType extends Instance<typeof MessageModel> {}
export interface MessageCreationType extends SnapshotIn<typeof MessageModel> {}
export interface ChatsType extends Instance<typeof ChatsModel> {}
