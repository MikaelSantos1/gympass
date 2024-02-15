import { env } from './env'
import { app } from './server'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => console.log('http server running'))
