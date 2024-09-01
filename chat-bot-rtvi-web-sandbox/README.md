# Real-Time Voice Inference SDK Demo (Daily)


## Link local package

From `rtvi-client-js` and `rtvi-client-react`:

```shell
yarn link
```

## Run dev server

```bash
yarn
yarn link chat-bot-rtvi-client
yarn link chat-bot-rtvi-daily-client
yarn link chat-bot-rtvi-web-react
yarn run dev
# or from project root
yarn workspace rtvi-sandbox dev
```

Create a `.env.local` in your root with a custom baseURL if you are running your own infra:

```
VITE_BASE_URL=http://...
```
