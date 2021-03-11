This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Set up

`npm install`

```
CREATE DATABASE chat_room;
CREATE USER 'chat_room_user'@'localhost' IDENTIFIED BY 'chat_room_password';
GRANT ALL PRIVILEGES ON *.* TO 'chat_room_user'@'localhost';
GRANT ALL PRIVILEGES ON chat_room.* TO 'chat_room_user'@'localhost';
FLUSH PRIVILEGES;
```

`
npx prisma migrate reset --preview-feature
`