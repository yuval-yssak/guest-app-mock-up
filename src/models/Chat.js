import { types } from 'mobx-state-tree'

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
    // default date to Unix epoch
    lastReadTimestamp: types.optional(types.Date, new Date(null))
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
  .actions(self => ({}))

export const Chat = types.optional(ChatModel, { messages: [] })
