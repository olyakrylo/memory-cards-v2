const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const Redis = require("ioredis");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });

const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("../certs/key.pem"),
  cert: fs.readFileSync("../certs/cert.pem"),
};

app.prepare().then(() => {
  const redis = new Redis(process.env.REDIS_URL, {
    password: process.env.REDIS_PASS,
  });

  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    req.redis = redis;
    handle(req, res, parsedUrl);
  }).listen(4000, (err) => {
    if (err) throw err;
    console.log("> Server started on https://localhost:4000");
  });
});
