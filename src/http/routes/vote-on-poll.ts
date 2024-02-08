import { z } from "zod"
import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { prisma } from "../../lib/prisma";
import { redes } from "../../lib/redis";
import { voting } from "../../utild/voting-pub-sub";

export async function voteOnPool(app: FastifyInstance){
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })
    const volteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const {pollId} = voteOnPollParams.parse(request.params)
    const {pollOptionId} = volteOnPollBody.parse(request.body)
  

    let {sessionId} = request.cookies;

    if(!sessionId){
      sessionId = randomUUID()
  
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true
      })
    }

    if(sessionId){
      const userPreviousVotePoll = await prisma.vote.findUnique({
        where:{
          sessionId_pollId: {
            pollId,
            sessionId
          }
        }
      }) 

      if(userPreviousVotePoll && userPreviousVotePoll.pollOptionId !== pollOptionId){
        // apagar o voto anterior
        // criar um novo
        await prisma.vote.delete({
          where: {
            id: userPreviousVotePoll.id
          }
        })

        const votes = await redes.zincrby(pollId, -1, userPreviousVotePoll.pollOptionId)

        voting.public(pollId, { pollOptionId, votes: Number(votes)})
        
      }else if(userPreviousVotePoll){
        return reply.status(400).send({message: 'You already voted on this poll'}) 
      }
    }

    await prisma.vote.create({
      data: {
        pollId,
        sessionId,
        pollOptionId
      }
    })

    const votes = await redes.zincrby(pollId, 1, pollOptionId)

    voting.public(pollId, { pollOptionId, votes: Number(votes)})

    return reply.status(201).send() 
  
  });
}