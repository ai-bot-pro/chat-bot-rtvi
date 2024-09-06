import { createRoot } from "react-dom/client";
import {
  LLMHelper,
  AchatbotMetrics,
  VoiceEvent,
  VoiceMessage,
  Transcript,
} from "chat-bot-rtvi-client";
import { DailyVoiceClient } from "chat-bot-rtvi-daily-client";
import { VoiceClientProvider } from "chat-bot-rtvi-web-react";
import { Sandbox } from "./SandboxApp";

const voiceClient = new DailyVoiceClient({
  baseUrl: import.meta.env.VITE_BASE_URL,
  enableMic: true,
  services: {
    vad: "daily",
    asr: "deepgram",
    llm: "together",
    tts: "edge",
  },
  config: [
    {
      service: "pipeline",
      options: [
        { name: "allow_interruptions", value: false },
        { name: "enable_metrics", value: true },
        { name: "report_only_initial_ttfb", value: true },
      ],
    },
    {
      service: "vad",
      options: [
        { name: "args", value: { stop_secs: 0.7 } },
        { name: "tag", value: "silero_vad_analyzer" },
      ],
    },
    {
      service: "asr",
      options: [
        { name: "args", value: { language: "zh", model: "nova-2" } },
        { name: "tag", value: "deepgram_asr_processor" },
      ],
    },
    {
      service: "llm",
      options: [
        { name: "model", value: "Qwen/Qwen2-72B-Instruct" },
        { name: "base_url", value: "https://api.together.xyz/v1" },
        {
          name: "messages",
          value: [
            {
              role: "system",
              content:
                //"You are a assistant called Frankie. You can ask me anything. Keep responses brief and legible. Please communicate in Chinese",
                "我是你的老板，你是一个叫弗兰基的助理。你可以问我任何问题。保持回答简短和清晰。请用中文回答。第一句话请说：老板您好，元气满满的一天，加油！",
            },
          ],
        },
        { name: "tag", value: "openai_llm_processor" },
      ],
    },
    {
      service: "tts",
      options: [
        {
          name: "args",
          value: {
            voice_name: "zh-CN-YunjianNeural",
            language: "zh",
            gender: "Male",
          },
        },
        { name: "tag", value: "tts_edge" },
      ],
    },
  ],

  // OpenAI/Anthropic function calling config
  /*
      config: [
      {
        service: "llm",
        options: [
          // or claude-3-5-sonnet-20240620
          { name: "model", value: "gpt-4o" },
          {
            name: "messages",
            value: [
              {
                // anthropic: user; openai: system
                role: "system",
                content:
                  "You are a cat named Clarissa. You can ask me anything. Keep response brief and legible. Start by telling me to ask for the weather in San Francisco.",
              },
            ],
          },
          // OpenAI

          {
            name: "tools",
            value: [
              {
                type: "function",
                function: {
                  name: "get_current_weather",
                  description:
                    "Get the current weather for a location. This includes the conditions as well as the temperature.",
                  parameters: {
                    type: "object",
                    properties: {
                      location: {
                        type: "string",
                        description:
                          "The city and state, e.g. San Francisco, CA",
                      },
                      format: {
                        type: "string",
                        enum: ["celsius", "fahrenheit"],
                        description:
                          "The temperature unit to use. Infer this from the users location.",
                      },
                    },
                    required: ["location", "format"],
                  },
                },
              },
            ],
          },

          // Anthropic

          // {
          //   name: "tools",
          //   value: [
          //     {
          //       name: "get_current_weather",
          //       description:
          //         "Get the current weather for a location. This includes the conditions as well as the temperature.",
          //       input_schema: {
          //         type: "object",
          //         properties: {
          //           location: {
          //             type: "string",
          //             description: "The city and state, e.g. San Francisco, CA",
          //           },
          //           format: {
          //             type: "string",
          //             enum: ["celsius", "fahrenheit"],
          //             description:
          //               "The temperature unit to use. Infer this from the users location.",
          //           },
          //         },
          //         required: ["location", "format"],
          //       },
          //     },
          //   ],
          // },
        ],
      },
    ],
    */
  timeout: 15 * 1000,
  enableCam: false,
  callbacks: {
    onMessageError: (message: VoiceMessage) => {
      console.log("[CALLBACK] Message error", message);
    },
    onError: (message: VoiceMessage) => {
      console.log("[CALLBACK] Error", message);
    },
    onGenericMessage: (data: unknown) => {
      console.log("[CALLBACK] Generic message:", data);
    },
    onConnected: () => {
      console.log("[CALLBACK] Connected");
    },
    onBotReady: () => {
      console.log("[CALLBACK] Bot ready");
    },
    onDisconnected: () => {
      console.log("[CALLBACK] Disconnected");
    },
    onTransportStateChanged: (state: string) => {
      console.log("[CALLBACK] State change:", state);
    },
    onBotConnected: () => {
      console.log("[CALLBACK] Bot connected");
    },
    onBotDisconnected: () => {
      console.log("[CALLBACK] Bot disconnected");
    },
    onBotStartedSpeaking: () => {
      console.log("[CALLBACK] Bot started talking");
    },
    onBotStoppedSpeaking: () => {
      console.log("[CALLBACK] Bot stopped talking");
    },
    onUserStartedSpeaking: () => {
      console.log("[CALLBACK] Local started talking");
    },
    onUserStoppedSpeaking: () => {
      console.log("[CALLBACK] Local stopped talking");
    },
    onMetrics: (data: AchatbotMetrics) => {
      console.log("[CALLBACK] Metrics:", data);
    },
    onUserTranscript(data: Transcript) {
      if (data.final) {
        console.log("[CALLBACK] User Transcript:", data.text);
      }
    },
    onBotTranscript(data: string) {
      console.log("[CALLBACK] Bot transcript:", data);
    },
  },
});

// Helpers
voiceClient.registerHelper(
  "llm",
  new LLMHelper({
    callbacks: {},
  })
) as LLMHelper;

// Some convenience events
// These are not required, but can be useful for debugging
voiceClient.on(VoiceEvent.TransportStateChanged, (state) => {
  console.log("[EVENT] Transport state change:", state);
});
voiceClient.on(VoiceEvent.BotReady, () => {
  console.log("[EVENT] Bot is ready");
});
voiceClient.on(VoiceEvent.Connected, () => {
  console.log("[EVENT] User connected");
});
voiceClient.on(VoiceEvent.Disconnected, () => {
  console.log("[EVENT] User disconnected");
});

// voiceClient.helper<LLMHelper>("llm").llmContext();

const rootContainer = document.querySelector("#app") ?? document.body;

const root = createRoot(rootContainer);

root.render(
  <VoiceClientProvider voiceClient={voiceClient}>
    <Sandbox />
  </VoiceClientProvider>
);
