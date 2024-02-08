// importação de módulos
import fastify from "fastify"; // importa o módulo Fastify para criar o servidor web.
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";

const app = fastify(); // cria uma instância do aplicativo Fastify.
const port = 3333; // porta do servidor.

app.register(createPoll); // registra a rota createPoll no aplicativo Fastify.
app.register(getPoll); // registra a rota createPoll no aplicativo Fastify.

app.listen({ port }).then(() => {
    console.log(`Servidor rodando na porta ${port}`);
});

// comentários adicionais explicando conceitos gerais do código
// (driver nativo, ORMs, métodos HTTP básicos, etc.)
