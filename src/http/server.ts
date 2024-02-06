import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createPool } from './routes/create-poll';
import { showPool } from './routes/show-poll';
import { voteOnPool } from './routes/vote-on-poll';

const app = fastify()

app.register(cookie, {
  secret: "my-secret-key",
  hook: 'onRequest',
})
app.register(createPool)
app.register(showPool)
app.register(voteOnPool)

app.listen({ port: 3333 }).then(() => {
  console.log(`HTTP server running!`);
});