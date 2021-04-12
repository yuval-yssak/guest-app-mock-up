import {
  Instance,
  types,
  getRoot,
  SnapshotIn,
  SnapshotOut,
  cast
} from 'mobx-state-tree'
import dayjs from 'dayjs'
import { now } from 'mobx-utils'
import { UserModel } from './UserModel'
import { ViewType } from './ViewModel'
const MessageModel = types
  .model('MessageModel', {
    user: types.reference(UserModel),
    timestamp: types.Date,
    content: types.string
  })
  .views(self => ({
    get messageSide() {
      let selfSide: boolean

      // determine message side according to the current view or current logged in user

      const view = (getRoot(self) as any)?.view as ViewType | undefined

      if (view?.page === '/chat' && view.id)
        selfSide = self.user.id !== +view.id
      else selfSide = (getRoot(self) as any).loggedInUser.id === self.user.id

      return selfSide ? 'self' : 'other'
    },

    get timeSignature() {
      function displayTime(timestamp: Date) {
        // triggers a rerender of the entire chat page once a minute
        if (dayjs(timestamp).year() !== dayjs(now(60000)).year())
          return dayjs(timestamp).format('MMM D, YYYY, HH:mm')
        if (
          dayjs(now(60000)).subtract(1, 'day').startOf('day').isAfter(timestamp)
        )
          return dayjs(timestamp).format('MMM D, HH:mm')
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
      if (self.lastReadTimestamp.getTime() === 0) return 0
      return self.messages.reduce(
        (count, message) =>
          count + (message.timestamp > self.lastReadTimestamp ? 1 : 0),
        0
      )
    }
  }))
  .actions(self => ({
    insertSelfMessage(message: MessageCreationType) {
      self.messages.push(message)
      self.lastReadTimestamp = new Date()
    },
    insertOtherMessage(message: MessageCreationType) {
      self.messages.push(message)
    }
  }))
  .actions(self => ({
    insertMessages(messages: MessageCreationType[]) {
      self.messages.push(...messages)
    }
  }))

const UserChatModel = types.model('UserChatModel', {
  user: types.reference(UserModel),
  chat: ChatModel
})

export const ChatsModel = types
  .model('ChatsModel', {
    withSelf: ChatModel,
    withUsers: types.maybe(types.array(UserChatModel))
  })
  .views(self => ({
    findChat(userId: number): ChatType | undefined {
      // userId === 0 means no user ID.
      if (!userId) return self.withSelf
      else
        return self.withUsers?.find(chatUser => chatUser.user.id === userId)
          ?.chat
    }
  }))
  .actions(self => ({
    addUserChats(userChats: UserChatCreationType[]) {
      if (!self.withUsers) self.withUsers = cast([])
      self.withUsers!.push(...userChats)
    }
  }))

export interface UserChatSnapshotType
  extends SnapshotOut<typeof UserChatModel> { }
export interface UserChatCreationType
  extends SnapshotIn<typeof UserChatModel> { }
export interface UserChatType extends Instance<typeof UserChatModel> { }
export interface ChatType extends Instance<typeof ChatModel> { }
export interface MessageType extends Instance<typeof MessageModel> { }
export interface MessageCreationType extends SnapshotIn<typeof MessageModel> { }
export interface ChatsType extends Instance<typeof ChatsModel> { }
