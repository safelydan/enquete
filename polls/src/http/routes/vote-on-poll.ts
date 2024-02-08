import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (req, res) => {
    // definição do esquema para o corpo da requisição usando a biblioteca Zod
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    // definição do esquema para os parâmetros da requisição usando a biblioteca Zod
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });

    // parse dos parâmetros da requisição
    const { pollId } = voteOnPollParams.parse(req.params);
    // parse do corpo da requisição
    const { pollOptionId } = voteOnPollBody.parse(req.body);

    // verificação do cookie de sessão
    let { sessionId } = req.cookies;

    // verificação se o usuário já votou nesta enquete
    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      // verificação e tratamento do voto anterior do usuário
      if (userPreviousVoteOnPoll) {
        if (userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
          // se o usuário já votou e escolheu uma opção diferente, exclui o voto anterior
          await prisma.vote.delete({
            where: {
              id: userPreviousVoteOnPoll.id,
            },
          });
        } else {
          // se o usuário já votou na mesma opção, retorna um erro
          return res.status(400).send({ msg: 'you already voted on this poll' });
        }
      }
    }

    // geração de um novo sessionId se não existir
    if (!sessionId) {
      sessionId = randomUUID();

      // configuração e envio do cookie de sessão
      res.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        signed: true,
        httpOnly: true,
      });
    }

    // criação do voto no banco de dados usando o Prisma Client
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    // resposta da requisição com status 201 (criado)
    return res.status(201).send();
  });
}
