import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
    // rota para criar uma nova enquete (POST /polls)
    app.post('/polls', async (req, res) => {
        // definição do esquema para o corpo da requisição usando a biblioteca Zod
        const createPollBody = z.object({
            title: z.string()
        });

        // validação do corpo da requisição usando o esquema definido anteriormente
        const { title } = createPollBody.parse(req.body);

        // criação de uma nova enquete no banco de dados usando o Prisma Client
        const poll = await prisma.poll.create({
            data: {
                title,
            }
        });

        // retorna a enquete criada como resposta da requisição com status 201 (criado)
        return res.status(201).send({ poll });
    });
}
