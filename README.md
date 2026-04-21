# Firebase Push Relay Documentation

## Description

Firebase Push Relay is a REST API service that acts as a relay for sending Firebase Cloud Messaging (FCM) push notifications. It provides a simple HTTP interface to send push notifications to mobile devices through Firebase.

## Installation

```bash
# Clone the repository
git clone https://github.com/sopheos/firebase_push_relay.git
cd firebase_push_relay


# Configure docker settings
cp .env.example .env

# Configure JWT key and firebase credentials (using service account)
cp config.exemple.json config.json

# Start the server
docker compose up -d
```

## API Endpoints


### GET /

Get the API version number and the minimum supported API version.

**Response:**

```json
{
  "currentVersion": 1,
  "minSupportedVersion": 1
}
```

### POST /v1/send

Send a push notification to a single device, topic, or condition.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | One of* | Single device FCM token |
| `topic` | string | One of* | Topic name to send to |
| `condition` | string | One of* | FCM condition expression |
| `tokens` | string[] | One of* | Array of device tokens (max 100) |
| `notification` | object | ** | Notification payload |
| `notification.title` | string | Yes | Notification title |
| `notification.body` | string | Yes | Notification body |
| `data` | object | ** | Custom data payload (key-value pairs) |

\* Exactly **one** target must be provided: `token`, `tokens`, `topic`, or `condition`

\*\* At least one of `notification` or `data` is required

**Data field restrictions:**
- Reserved keys not allowed: `from`, `notification`, `message_type`
- Reserved prefixes not allowed: `google`, `gcm`

**Example Request:**

```json
{
  "token": "device_fcm_token_here",
  "notification": {
    "title": "Hello",
    "body": "World"
  },
  "data": {
    "action": "open_screen",
    "screen_id": "123"
  }
}
```

**Success Response:**

```json
{
  "message": "Message received successfully"
}
```

### POST /v1/send-batch

Send multiple push notifications in a single request.

**Request Body:**

An array of message objects (max 1000 messages per batch). Each message follows the same schema as `/v1/send`:


**Example Request:**

```json
[
  {
    "token": "device_token_1",
    "notification": {
      "title": "Hello User 1",
      "body": "Your order is ready"
    }
  },
  {
    "token": "device_token_2",
    "notification": {
      "title": "Hello User 2",
      "body": "New message received"
    },
    "data": {
      "action": "open_chat",
      "chat_id": "456"
    }
  },
  {
    "topic": "news",
    "notification": {
      "title": "Breaking News",
      "body": "Something important happened"
    }
  }
]
```

**Success Response:**

```json
{
  "message": "Batch of X messages received successfully",
}
```

### GET /v1/fails

Retrieve a list of failed FCM device tokens (max 1000 tokens per request).

These are tokens that have been marked as invalid or unregistered by Firebase. Use this endpoint to clean up your token database.

**Success Response (with failed tokens):**

```json
["device_token_1", "device_token_2", "device_token_3"]
```

**Success Response (no failed tokens):**

```json
[]
```

### POST /v1/subscribe

Subscribe one or more device tokens to a topic.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tokens` | string[] | Yes | Array of device FCM tokens (1-100 tokens) |
| `topic` | string | Yes | Topic name to subscribe to (non-empty) |

**Example Request:**

```json
{
  "tokens": ["device_token_1", "device_token_2"],
  "topic": "news"
}
```

**Success Response:**

```json
{
  "message": "Successfully subscribed 2 tokens to topic news"
}
```

### POST /v1/unsubscribe

Unsubscribe one or more device tokens from a topic.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `tokens` | string[] | Yes | Array of device FCM tokens (1-100 tokens) |
| `topic` | string | Yes | Topic name to unsubscribe from (non-empty) |

**Example Request:**

```json
{
  "tokens": ["device_token_1", "device_token_2"],
  "topic": "news"
}
```

**Success Response:**

```json
{
  "message": "Successfully unsubscribed 2 tokens from topic news"
}
```
