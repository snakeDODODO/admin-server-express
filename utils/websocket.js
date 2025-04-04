const WebSocket = require('ws');
const url = require('url');
const { v4: uuidv4 } = require('uuid');

// 存储所有连接的客户端
const clients = new Map();

// 初始化WebSocket服务器
function initWebSocketServer(server) {
  const wss = new WebSocket.Server({ noServer: true });

  // 处理连接请求 在www文件中监听/ws/notice路径的请求，当请求发生时，升级为WebSocket连接
  server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/ws/notice') {
      // 升级请求为websocket连接
      wss.handleUpgrade(request, socket, head, ws => {
        // 触发连接事件
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  // 处理新连接
  wss.on('connection', (ws, request) => {
    // 解析查询参数获取用户ID
    const { query } = url.parse(request.url, true);
    const userId = query.userId;

    if (!userId) {
      ws.close(4000, 'Missing userId parameter');
      return;
    }

    // 为连接分配唯一ID
    const clientId = uuidv4();
    const clientInfo = {
      id: clientId,
      userId: userId,
      connection: ws
    };

    // 存储客户端连接
    clients.set(clientId, clientInfo);
    console.log(`Client connected: ${clientId}, userId: ${userId}`);

    // 发送欢迎消息
    ws.send(
      JSON.stringify({
        type: 'connection',
        message: '连接成功',
        clientId: clientId
      })
    );

    // 处理消息
    ws.on('message', message => {
      try {
        const data = JSON.parse(message);
        console.log(`Received message from ${clientId}:`, data);

        // 处理客户端消息
        // 这里可以添加消息处理逻辑
      } catch (error) {
        console.error('Invalid message format:', error);
      }
    });

    // 处理连接关闭
    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    });

    // 处理错误
    ws.on('error', error => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      clients.delete(clientId);
    });
  });

  return wss;
}

// 向特定用户发送通知
function sendNoticeToUser(userId, notice) {
  let sent = false;

  clients.forEach(client => {
    if (client.userId === userId && client.connection.readyState === WebSocket.OPEN) {
      client.connection.send(JSON.stringify(notice));
      sent = true;
    }
  });

  return sent;
}

// 向所有用户广播通知
function broadcastNotice(notice) {
  clients.forEach(client => {
    if (client.connection.readyState === WebSocket.OPEN) {
      client.connection.send(JSON.stringify(notice));
    }
  });
}

// 批量向多个用户发送通知
function sendNoticeToBatchUsers(userIds, notice) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    console.warn('没有指定有效的用户ID数组');
    return { sent: 0, total: 0 };
  }

  // let sentCount = 0;
  const userIdSet = new Set(userIds.map(id => id.toString())); // 转换为字符串并去重

  clients.forEach(client => {
    if (userIdSet.has(client.userId) && client.connection.readyState === WebSocket.OPEN) {
      try {
        client.connection.send(JSON.stringify(notice));
        // sentCount++;
      } catch (error) {
        console.error(`向用户 ${client.userId} 发送通知失败:`, error);
      }
    }
  });

  // return {
  //   sent: sentCount,
  //   total: userIdSet.size,
  //   success: sentCount > 0
  // };
}

// 创建消息通知
function createMessageNotice(userId, title, content, sender) {
  return {
    type: 'message',
    id: uuidv4(),
    userId,
    title,
    content,
    sender,
    timestamp: new Date().toISOString(),
    read: false
  };
}

// 创建任务通知
function createTaskNotice(userId, title, content, status, startTime, endTime) {
  return {
    type: 'task',
    id: uuidv4(),
    userId,
    title,
    content,
    status, // 'not_started', 'in_progress', 'completed', 'expired'
    startTime,
    endTime,
    timestamp: new Date().toISOString(),
    read: false
  };
}

module.exports = {
  initWebSocketServer,
  sendNoticeToUser,
  broadcastNotice,
  sendNoticeToBatchUsers, // 添加新方法到导出
  createMessageNotice,
  createTaskNotice
};
