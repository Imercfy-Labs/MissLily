import React from 'react'

interface Message {
  id: string
  text: string
  role: 'user' | 'assistant'
  isFinal: boolean
}

interface MessagesListProps {
  messages: Message[]
}

const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="messages">
        <div className="empty-messages">
          <div className="empty-illustration">
            <span>💬</span>
          </div>
          <p>Your conversation will appear here</p>
          <p className="empty-subtitle">Start speaking to interact with the AI</p>
        </div>
      </div>
    )
  }

  return (
    <div className="messages">
      {messages.map((message) => (
        <div 
          key={message.id}
          className={`message ${message.role} ${!message.isFinal ? 'tentative' : ''}`}
        >
          <div className="message-avatar">
            {message.role === 'user' ? '👤' : '🤖'}
          </div>
          <div className="message-content">
            <div className="message-header">
              <span className="message-sender">{message.role === 'user' ? 'You' : 'Assistant'}</span>
              {!message.isFinal && <span className="message-status">typing...</span>}
            </div>
            <div className="message-text">
              {message.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessagesList 