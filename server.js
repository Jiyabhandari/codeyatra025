const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve a basic HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle messages sent by the client
  socket.on('message', async (data) => {
    console.log('Message received:', data);
    
    // If the message contains "sendSMS", send an SMS
    if (data.includes("sendSMS")) {
      try {
        const response = await fetch('http://api.sparrowsms.com/v2/sms/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            token: 'v2_8WPPbKnTIHEao1PoiobQUnSjiAE.1TYZ',
            from: 'Demo',
            to: '9845990052',
            text: 'तपाईंको शहर, तपाईंको फोहोर, तपाईंको नियन्त्रण।',
          }),
        });
        
        const responseData = await response.json();
        console.log('SMS sent successfully:', responseData);
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    } else {
      console.log('No SMS triggered, message did not meet conditions.');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
