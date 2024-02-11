import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";

export async function getPoll(app: FastifyInstance) {
    // rota GET para buscar uma enquete específica com base no 'pollId'
    app.get('/polls/:pollId', async (req, res) => {
        // define um esquema Zod para validar os parâmetros da solicitação
        const getPollParams = z.object({
            // o parâmetro 'pollId' na URL deve ser uma string no formato UUID
            pollId: z.string().uuid(),
        });

        // extrai e valida os parâmetros da solicitação usando o esquema definido
        const { pollId } = getPollParams.parse(req.params);

        // busca uma enquete única no banco de dados, incluindo detalhes das opções associadas
        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId,
            },
            include: {
                options: {
                    select: {
                        id: true,    // inclui o ID da opção
                        title: true  // inclui o título da opção
                    }
                }
            }
        })

        if(!poll) {
            return res.status(400).send({msg: 'poll not found'})
        }

        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES')
        
        const votes = result.reduce((obj, line, index)=>{
            if(index % 2 === 0){
                const score = result[index +  1]

                Object.assign(obj, {[line]: Number(score)})
            }
            return obj
        }, {} as Record<string, number>)
        console.log(votes)

        // retorna a resposta com a enquete encontrada ou null se não existir
        return res.send({
            id: poll.id,
            title: poll.title,
            options: poll.options.map(option => {
                return {
                    id: option.id,
                    title: option.title,
                    score: (option.id in votes) ? votes[option.id] : 0
                }
            })
        })
    });
}
