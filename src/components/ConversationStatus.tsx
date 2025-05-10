import React from 'react'

interface ConversationStatusProps {
  status: 'connected' | 'disconnected'
  isSpeaking: boolean
}

const ConversationStatus: React.FC<ConversationStatusProps> = ({
  status,
  isSpeaking
}) => {
  // Generate wave bars for the speaking animation
  const renderWaveAnimation = () => {
    return (
      <div className="wave-container">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="wave-bar" />
        ))}
      </div>
    )
  }

  return (
    <div className="status-wrapper">
      <div className="status-row">
        <div className="status-badge">
          <span 
            className={`status-indicator status-${status}`} 
          />
          <span>{status === 'connected' ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      <div className="status-row" style={{ marginTop: '1rem' }}>
        <div className="speaking-status">
          {isSpeaking ? (
            <>
              <div className="speaking-badge">
                <span>Speaking</span>
              </div>
              <div className="speaking-indicator">
                {renderWaveAnimation()}
              </div>
            </>
          ) : (
            <div className="listening-badge">
              <span>Listening</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationStatus 