import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createPoll(app: FastifyInstance) {
    // rota para criar uma nova enquete (POST /polls)
    app.post('/polls', async (req, res) => { // a função aceita um argumento app que é uma instância do FastifyInstance.
        // definição do esquema para o corpo da requisição usando a biblioteca Zod
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string())
        });

        // validação do corpo da requisição usando o esquema definido anteriormente
        const { title, options } = createPollBody.parse(req.body);

        // cria uma nova enquete no banco de dados usando o Prisma Client
        const poll = await prisma.poll.create({
            // define os dados a serem inseridos na tabela 'poll'
            data: {
                // atribui o título da enquete ao campo 'title' da tabela 'poll'
                title,

                // o campo 'options' representa o relacionamento com a tabela 'pollOption'
                options: {
                    // utiliza 'createMany' para criar várias entradas na tabela 'pollOption'
                    createMany: {
                        // mapeia as opções recebidas para um array de objetos
                        // cada objeto possui a estrutura { title: option }
                        data: options.map(option => {
                            return { title: option };
                        }),
                    },
                },
            },
        });



        // retorna a enquete criada como resposta da requisição com status 201 (criado)
        return res.status(201).send({ poll });
    });
}
