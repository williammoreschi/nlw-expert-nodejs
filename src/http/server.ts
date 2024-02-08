import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket';
import { createPool } from './routes/create-poll';
import { showPool } from './routes/show-poll';
import { voteOnPool } from './routes/vote-on-poll';
import { pollResults } from './ws/poll-results';

const app = fastify()

app.register(cookie, {
  secret: "my-secret-key",
  hook: 'onRequest',
})

app.register(websocket)

app.register(createPool)
app.register(showPool)
app.register(voteOnPool)

app.register(pollResults)

app.listen({ port: 3333 }).then(() => {
  console.log(`HTTP server running!`);
});