const server = require('./src/app');

server.listen(process.env.PORT || 7000, () => {
  console.log(`Languages Service working in port: ${process.env.PORT || 7000}`);
});