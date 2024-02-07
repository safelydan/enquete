// importação de módulos
import fastify from "fastify"; // importa o módulo Fastify para criar o servidor web.
import { PrismaClient } from "@prisma/client"; // importa o PrismaClient para interação com o banco de dados.
import { z } from "zod"; // importa a biblioteca Zod para validação de esquema.

const app = fastify(); // cria uma instância do aplicativo Fastify.
const prisma = new PrismaClient(); // inicializa o Prisma Client para interação com o banco de dados.
const port = 3333; // porta do servidor.

app.post('/polls', async (req, res) => {
    // definição do esquema para o corpo da requisição
    const createPollBody = z.object({
        title: z.string()
    });

    // validação do corpo da requisição usando o esquema
    const { title } = createPollBody.parse(req.body);

    // criação de uma nova enquete no banco de dados usando o Prisma Client
    const poll = await prisma.poll.create({
        data: {
            title,
        }
    });

    // retorna a enquete criada como resposta da requisição com status 201
    return res.status(201).send({ poll });
});

app.listen({ port }).then(() => {
    console.log(`Servidor rodando na porta ${port}`);
});

// comentários adicionais explicando conceitos gerais do código
// (driver nativo, ORMs, métodos HTTP básicos, etc.)
