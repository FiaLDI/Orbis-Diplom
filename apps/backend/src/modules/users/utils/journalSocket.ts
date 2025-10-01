
import { ioJournal } from "@/server";

import { redisClient } from '@/config';
import { Socket } from "socket.io";


export const journalSocket = (socket: Socket) => {
    console.log('Новый пользователь подключился:', socket.id);

    socket.on('set-status', (userId, status) => {
        redisClient.set(`user:${userId}:${status}`, 'true');
        socket.broadcast.emit('user-online', userId);
    });

     socket.on('join-server', (serverId) => {
        console.log(`${serverId} join ${socket.id}`)
        socket.join(`server:${serverId}`);
    });

    socket.on('leave-server', (serverId) => {
        console.log(`${serverId} leave ${socket.id}`)
        socket.leave(`server:${serverId}`);
    });

    
    socket.on('update-into-server', (signal, serverId) => {
        if (signal == "update-server-active") {
            ioJournal.to(`server:${serverId}`).emit('update-into-server');
            console.log(`Обновление для участников сервера ${serverId}`);
        }
    })
  
    socket.on('disconnect', () => {
        //redisClient.del(`user:${socket.userId}:${socket.status}`);
        //socket.broadcast.emit('user-offline', socket.userId);
    });
  
  }