# Chat Bot Realtime Voice Inference (RTVI) Daily WebRTC Web / TS(JS) SDK
Chat Bot RTVI Daily WebRTC TS(JS) SDK with RTVI Multimodal interaction configuration.

## Install

```bash
yarn add chat-bot-rtvi-daily-client
# or
npm install chat-bot-rtvi-daily-client
```

## Quick Start

Instantiate a `DailyVoiceClient` instance, wire up the bot's audio, and start the conversation:

```ts
import { DailyVoiceClient } from "chat-bot-rtvi-daily-client";

const handleTrackStarted = (track, participant) => {
  if (participant.local || track.kind !== "audio") return;
  const audioEl = document.createElement("audio");
  audioEl.srcObject = new MediaStream([track]);
  document.body.appendChild(audioEl);
  audioEl.play();
};

const voiceClient = new DailyVoiceClient({
  baseUrl: "http://0.0.0.0:4321/bot_join/DailyRTVIBot", // rtvi bots with daily web rtc input/output audio stream
  enableMic: true,
  callbacks: {
    onTrackStarted: handleTrackStarted,
  },
  customHeaders: {"Authorization":"Bearer XXXX"} // JWT auth
});

voiceClient.start();
```