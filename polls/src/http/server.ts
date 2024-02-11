// importação de módulos
import fastify from "fastify" 
import cookie from '@fastify/cookie' 
import websocket from "@fastify/websocket"
import { createPoll } from "./routes/create-poll"
import { getPoll } from "./routes/get-poll" 
import { voteOnPoll } from "./routes/vote-on-poll"
import { pollResults } from "../ws/poll-results"

const app = fastify() // cria uma instância do aplicativo Fastify.
const port = 3333 

app.register(cookie, {
    secret: 'pools-app-nlw', // define a chave secreta para assinar os cookies.
    hook: 'onRequest', // define o momento em que o plugin de cookie deve ser executado (antes de processar a requisição).
    parseOptions: {}  // define opções de análise dos cookies.
})

app.register(websocket)

app.register(createPoll); 
app.register(getPoll); 
app.register(voteOnPoll);
app.register(pollResults) 

app.listen({ port }).then(() => {
    console.log(`Servidor rodando na porta ${port}`)
});

// (driver nativo, ORMs, métodos HTTP básicos, etc.)
