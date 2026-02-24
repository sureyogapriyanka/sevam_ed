# Internal Chat System Documentation

## Overview
The internal chat system allows patients and reception staff to communicate directly with doctors through a real-time messaging interface. Messages are directed to specific doctors and display as unread until read.

## Features Implemented

### 1. Directed Messaging
- Messages sent to specific doctors (like "Dr. Smith") are properly routed to that doctor
- Patient and reception staff can select from a list of available doctors
- Messages are tagged with sender and receiver information

### 2. Unread Message Tracking
- Messages show as unread until they are read by the recipient
- Visual indicators (badges) show unread message counts
- Real-time updates when messages are read

### 3. Chat Dashboard
- Dedicated chat dashboard page for full-screen messaging
- Conversation list with search functionality
- Message history display with timestamps
- Online status indicators for users

### 4. Real-time Communication
- WebSocket-based real-time messaging
- Instant message delivery notifications
- Message status tracking (sent, delivered, read)

## Components

### ChatInterface.tsx
The floating chat widget that appears in the bottom right corner of the screen. This component:
- Shows a toggle button with unread message count
- Displays conversation list when opened
- Allows sending messages to specific doctors
- Shows real-time message updates

### ChatDashboard.tsx
Full-screen chat interface accessible via the /chat route. This component:
- Provides a larger messaging interface
- Shows all conversations in a sidebar
- Displays message history in the main panel
- Includes search functionality for contacts

### useWebSocket.ts
Custom hook for managing WebSocket connections:
- Handles connection establishment and reconnection
- Manages message sending and receiving
- Tracks message delivery status
- Updates message read status

### messageService.ts
API service for chat messages:
- Send new messages
- Retrieve message history
- Mark messages as read
- Get unread message counts

## How It Works

### Message Routing
1. When a user selects a doctor from the contact list, that doctor becomes the message recipient
2. Messages are sent through WebSocket with senderId and receiverId
3. The backend routes messages to the correct recipient
4. Recipients receive real-time notifications of new messages

### Unread Message Tracking
1. When a message is sent, the recipient's unread count is incremented
2. Visual badges show unread message counts in the conversation list
3. When a user opens a conversation, messages are marked as read
4. Read status is updated in real-time for both sender and receiver

### Message Display
1. Messages are displayed in the chat interface with timestamps
2. User's own messages appear on the right side
3. Received messages appear on the left side
4. Messages show delivery status (sending, delivered, read)

## Usage

### For Patients
1. Click the chat icon in the bottom right corner
2. Select a doctor from the conversation list
3. Type your message in the input field
4. Press Enter or click Send to send the message
5. View message delivery status in the chat

### For Reception Staff
1. Click the chat icon in the bottom right corner
2. Select a doctor or patient from the conversation list
3. Type your message in the input field
4. Optionally mark as urgent for emergency messages
5. Press Enter or click Send to send the message

### For Doctors
1. Access the full chat dashboard at /chat
2. View all conversations in the sidebar
3. Select a conversation to view message history
4. Send replies directly from the dashboard

## Technical Implementation

### WebSocket Protocol
Messages are sent as JSON objects with the following structure:
```json
{
  "type": "chat_message",
  "senderId": "user123",
  "receiverId": "doctor456",
  "content": "Hello, I need assistance",
  "messageType": "direct",
  "createdAt": "2023-05-15T10:30:00Z",
  "readStatus": "sent"
}
```

### Message Status Flow
1. **sent** - Message has been sent from client
2. **delivered** - Message has been received by server and routed to recipient
3. **read** - Recipient has opened the conversation and read the message

### Data Storage
Messages are stored in the backend database with the following fields:
- id: Unique message identifier
- senderId: ID of the user who sent the message
- receiverId: ID of the intended recipient
- content: Message text content
- createdAt: Timestamp when message was sent
- readStatus: Current read status of the message
- messageType: Type of message (direct, emergency, etc.)

## Future Enhancements
- File attachments support
- Message encryption for privacy
- Group chat functionality
- Message search and filtering
- Chat history export
- Typing indicators
- Push notifications for offline users