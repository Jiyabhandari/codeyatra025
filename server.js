const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fetch = require('node-fetch'); // Ensure node-fetch is installed

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Predefined location (center of the radius)
const predefinedLat = 27.7172; // Example: Kathmandu Latitude
const predefinedLng = 85.3240; // Example: Kathmandu Longitude
const radius = 5; // Radius in kilometers

// Haversine formula to calculate distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Serve a basic HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle messages sent by the client
  socket.on('message', async (data) => {
    console.log('Message received: ', data);

    const { lat, lon } = data; // Extract lat and lon from the message

    // Check if lat and lon are valid numbers
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      console.error('Invalid coordinates received:', lat, lon);
      return; // Don't proceed if the coordinates are invalid
    }

    // Log the coordinates to ensure they are correct
    console.log(`Received coordinates: Latitude: ${lat}, Longitude: ${lon}`);

    // Calculate the distance using the haversine formula
    const distance = haversine(predefinedLat, predefinedLng, lat, lon);
    console.log(`Distance: ${distance} km`);

    // If the user is within the specified radius, send an SMS
    if (distance <= radius) {
      /*
      try {
        const response = await fetch('http://api.sparrowsms.com/v2/sms/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            token: 'v2_8WPPbKnTIHEao1PoiobQUnSjiAE.1TYZ',  // Replace with your token
            from: 'Demo',  // Sender ID
            to: '9849966477',  // Recipient's phone number
            text: 'User is within the defined radius. SMS sent.',  // Fixed message content
          }),
        });

        const responseData = await response.json();
        console.log('SMS sent successfully:', responseData);
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
      */
  } else {
    console.log('User is outside the defined radius. No SMS sent.');
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
// const port = process.env.PORT || 3001; // Change 3000 to 3001
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });