import { useState, useEffect, useRef } from 'react'
import { useConversation } from '@11labs/react'
import VolumeControl from './components/VolumeControl'
import assistantImage from './assets/AIAgent.jpeg'

type Message = {
  id: string
  text: string
  role: 'user' | 'assistant'
  isFinal: boolean
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [agentId] = useState<string>("NIBY37PELbQIwzTSbrwU") // Predefined agent ID
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [micPermission, setMicPermission] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState<number>(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const keepAliveIntervalRef = useRef<number | null>(null)

  // Initialize the conversation hook
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs Conversational AI')
      setErrorMessage(null)
      setRetryCount(0)
      startKeepAlive()
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs Conversational AI')
      stopKeepAlive()
      
      if (conversationId && retryCount < 3) {
        console.log(`Attempting to reconnect (attempt ${retryCount + 1})...`)
        setErrorMessage(`Connection lost. Reconnecting... (attempt ${retryCount + 1})`)
        
        if (reconnectTimeoutRef.current) {
          window.clearTimeout(reconnectTimeoutRef.current)
        }
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          handleReconnect()
        }, 2000)
      } else if (retryCount >= 3) {
        setErrorMessage("Could not reconnect after multiple attempts. Please try restarting the conversation.")
      }
    },
    onMessage: (msg: any) => {
      if (msg.source === 'assistant' || msg.source === 'user') {
        const messageId = msg.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const existingMessageIndex = messages.findIndex(
          (m) => m.id === messageId
        )

        if (existingMessageIndex >= 0) {
          const updatedMessages = [...messages]
          updatedMessages[existingMessageIndex] = {
            id: messageId,
            text: msg.message,
            role: msg.source,
            isFinal: msg.isFinal || false
          }
          setMessages(updatedMessages)
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: messageId,
              text: msg.message,
              role: msg.source,
              isFinal: msg.isFinal || false
            }
          ])
        }
      }
      
      if (msg.source === 'assistant') {
        setIsSpeaking(true)
      } else if (msg.source === 'user' && msg.isFinal) {
        setIsSpeaking(false)
      }
    },
    onError: (error) => {
      console.error('Error in conversation:', error)
      setErrorMessage('Error in conversation. Please try restarting.')
      setIsSpeaking(false)
    }
  })

  const startKeepAlive = () => {
    stopKeepAlive()
    keepAliveIntervalRef.current = window.setInterval(() => {
      if (conversation.status === 'connected') {
        try {
          conversation.setVolume({ volume: 0.8 })
          console.log("Keep-alive ping sent")
        } catch (error) {
          console.error("Keep-alive ping failed:", error)
        }
      }
    }, 15000)
  }
  
  const stopKeepAlive = () => {
    if (keepAliveIntervalRef.current) {
      window.clearInterval(keepAliveIntervalRef.current)
      keepAliveIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
      }
      stopKeepAlive()
    }
  }, [])

  const handleReconnect = async () => {
    try {
      if (conversationId) {
        setRetryCount(prev => prev + 1)
        const currentRetry = retryCount + 1
        const backoffTime = Math.min(Math.pow(2, currentRetry) * 1000, 10000)
        console.log(`Reconnecting in ${backoffTime}ms (attempt ${currentRetry})...`)
        
        await conversation.startSession({
          agentId: agentId
        })
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error)
      if (retryCount < 3) {
        const nextRetry = retryCount + 1
        const backoffTime = Math.min(Math.pow(2, nextRetry) * 1000, 10000)
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
          handleReconnect()
        }, backoffTime)
      } else {
        setErrorMessage("Failed to reconnect. Please try restarting the conversation manually.")
      }
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicPermission(true)
      return true
    } catch (error) {
      console.error('Microphone permission denied:', error)
      setMicPermission(false)
      return false
    }
  }

  const startConversation = async () => {
    setErrorMessage(null)
    setRetryCount(0)
    
    const hasMicPermission = await checkMicrophonePermission()
    if (!hasMicPermission) {
      alert('Microphone permission is required to use the voice conversation')
      return
    }

    try {
      const id = await conversation.startSession({
        agentId: agentId
      })
      setConversationId(id)
      setMessages([])
    } catch (error) {
      console.error('Failed to start conversation:', error)
      setErrorMessage('Failed to start conversation. Please try again.')
    }
  }

  const endConversation = async () => {
    try {
      stopKeepAlive()
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      
      await conversation.endSession()
      setConversationId(null)
      setErrorMessage(null)
      setRetryCount(0)
      setMessages([])
    } catch (error) {
      console.error('Error ending conversation:', error)
    }
  }

  const setVolume = async (volume: number) => {
    try {
      await conversation.setVolume({ volume })
    } catch (error) {
      console.error('Error setting volume:', error)
    }
  }

  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  return (
    <div className="app-container">
      <div className="minimal-ui">
        <div className="circular-ui">
          <div className={`assistant-image-container${isSpeaking ? ' speaking' : ''}`}>
            <img src={assistantImage} alt="AI Assistant" />
          </div>
          <button
            className={`call-ai-button${conversationId ? ' end-call' : ''}`}
            onClick={!micPermission ? checkMicrophonePermission : (conversationId ? endConversation : startConversation)}
            disabled={false}
          >
            {!micPermission ? 'Enable Microphone' : (conversationId ? 'End' : 'Call AI')}
          </button>
        </div>
        
        {conversationId && (
          <div className="minimal-controls">
            <VolumeControl onVolumeChange={setVolume} />
          </div>
        )}
        
        {!micPermission && (
          <p className="mic-notice">
            <span className="mic-icon">🎤</span> Microphone access required
          </p>
        )}
        
        {errorMessage && (
          <div className="error-container">
            <p className="error-message">{errorMessage}</p>
            {retryCount >= 3 && (
              <button 
                onClick={startConversation}
                className="restart-button"
              >
                Restart
              </button>
            )}
          </div>
        )}

        {messages.length > 0 && (
          <div className="minimal-transcript">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`transcript-message ${message.role}`}
              >
                <span className="message-role">
                  {message.role === 'user' ? 'You' : 'AI'}
                </span>
                <span className="message-text">
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App 