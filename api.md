GET /comment/:id
POST /comment
GET /comment/post/:id
GET /comment/user/:username
DELETE /comment/:id
POST /comment/:id/like
POST /comment/:id/unlike

# Get Chat group

GET /message/chat/:id

# Create Chat group

POST /message/chat

# Get chat groups of a user

GET /message/:username/chats

# Get messages of a chat group

GET /message/chat/:id/messages

# Send a message

POST /message

# Change chat group name

PUT /message/chat/:id/name

# Change chat group description

PUT /message/chat/:id/desc

# Change chat group picture

PUT /message/chat/:id/picture

# Add user to a chat group

PUT /message/chat/:id/user

# Remove a user from a chat group

DELETE /message/chat/:id/user

# Delete a chat group

DELETE /message/chat/:id

# Delete a message

DELETE /message/:id

# Get chat group information

GET /message/chat/:id/info

# Get chat group invite link

GET /message/chat/:id/invite

# Get chat group preferences for a user

GET /message/chat/:id/pref

# Make user admin

PUT /message/chat/:id/add-admin

# Remove admin

PUT /message/chat/:id/remove-admin

# Block group

PUT /message/chat/:id/block

# Reply to a message

POST /message/:id/reply

# Send an emote to a message

POST /message/:id/emote

# Pin a message

PUT /message/:id/pin

# Get pinned messages for a chat group

GET /message/chat/:id/pins

# Send read information for a message

PUT /message/:id/read

# Search in a chat group

?q=myStr&type=[messages,media,users,all]&from=(username)
POST /message/chat/:id/search

---

# Create a notification

POST /notification

# Get a notification

GET /notification/:id

# Get all notifications for a user

GET /notification/user/:username

# Get unread notifications for a user

GET /notification/user/:username/unread

# Get read notifications for a user

GET /notification/user/:username/read

# Read a notification

PUT /notification/:id/read

# Unread a notification

PUT /notification/:id/unread

# Read all notifications

PUT /notification/user/:username/read-all

# Unread all notifications

PUT /notification/user/:username/unread-all

# Dismiss a notification

DELETE /notification/:id

# Dismiss all notifications

DELETE /notification/user/:username

# Dismiss all read notifications

DELETE /notification/user/:username/read

# Dismiss all unread notifications

DELETE /notification/user/:username/unread

# Get unread notifications count

## GET /notification/user/:username/unread/count
