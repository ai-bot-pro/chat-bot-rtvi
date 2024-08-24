import { VoiceClient, VoiceClientOptions } from "chat-bot-rtvi-client";

import { DailyTransport } from "./transport";

/**
 * Daily RTVI Voice Client
 */
export class DailyVoiceClient extends VoiceClient {
  constructor({ ...opts }: VoiceClientOptions) {
    const options: VoiceClientOptions = {
      ...opts,
      transport: DailyTransport,
      services: opts.services,
      config: opts.config || [],
      config_dict: opts.config_dict || {},
    };

    super(options);
  }
}
