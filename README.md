# ElevenLabs Conversational AI Demo

This is a demonstration of the ElevenLabs Conversational AI SDK using React. The application allows you to interact with an ElevenLabs AI agent through your microphone.

## Features

- Connect to ElevenLabs Conversational AI using your Agent ID
- Voice-based conversations with the AI agent
- Real-time transcription of your speech
- Adjustable volume control
- Visual indicators for connection status and when the agent is speaking

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- An ElevenLabs account with a valid API key
- A created Conversational AI agent (you'll need the Agent ID)

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter your Agent ID in the input field
2. Allow microphone access when prompted
3. Click "Start Conversation" to begin
4. Speak into your microphone to interact with the agent
5. Adjust the volume as needed
6. Click "End Conversation" when you're done

## Notes

- For public agents, you only need to provide the Agent ID
- For private agents, you'll need to generate a signed URL from your server using your API key
- The conversation requires microphone access to function

## Resources

- [ElevenLabs Website](https://elevenlabs.io)
- [ElevenLabs React SDK Documentation](https://docs.elevenlabs.io/sdk/react-sdk)
- [ElevenLabs Conversational AI Documentation](https://docs.elevenlabs.io/api-reference/conversational-ai) 