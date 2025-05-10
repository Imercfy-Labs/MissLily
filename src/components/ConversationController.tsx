import React from 'react';
import { useConversation } from '@11labs/react';

interface ConversationControllerProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: any) => void;
}

const ConversationController: React.FC<ConversationControllerProps> = ({
  onConnect,
  onDisconnect,
  onMessage,
  onError,
}) => {
  useConversation({
    onConnect,
    onDisconnect,
    onMessage,
    onError,
  });

  return null;
};

export default ConversationController; 