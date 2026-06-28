'use strict';

const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const match = require('@unblockneteasemusic/server');
const { serveNcmApi } = require('netease-cloud-music-api-alger/server');

const app = express();
const port = parsePort(process.env.PORT, 4488);
const ncmApiPort = parsePort(process.env.NCM_API_PORT, 30488);
const host = process.env.HOST || '0.0.0.0';
const ncmApiHost = '127.0.0.1';
const staticDir = path.resolve(__dirname, '..', 'out', 'renderer');
const indexHtml = path.join(staticDir, 'index.html');

let ncmApiApp;
let webServer;

function parsePort(value, fallback) {
  const portValue = Number(value || fallback);

  if (!Number.isInteger(portValue) || portValue < 1 || portValue > 65535) {
    throw new Error(`Invalid port: ${value}`);
  }

  return portValue;
}

function getMusicSources(value) {
  return String(value || process.env.MUSIC_SOURCES || 'migu,kugou,kuwo,pyncmd')
    .split(',')
    .map((source) => source.trim())
    .filter(Boolean);
}

function proxyNcmApi(req, res) {
  const upstreamPath = req.originalUrl.replace(/^\/api(?=\/|$)/, '') || '/';
  const headers = { ...req.headers, host: `${ncmApiHost}:${ncmApiPort}` };

  delete headers.connection;

  const proxyReq = http.request(
    {
      hostname: ncmApiHost,
      port: ncmApiPort,
      path: upstreamPath,
      method: req.method,
      headers
    },
    (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 502;

      Object.entries(proxyRes.headers).forEach(([name, value]) => {
        if (value !== undefined) {
          res.setHeader(name, value);
        }
      });

      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (error) => {
    console.error('Netease API proxy error:', error);
    if (!res.headersSent) {
      res.status(502).json({ code: 502, message: 'Netease API is unavailable' });
    } else {
      res.end();
    }
  });

  req.pipe(proxyReq);
}

async function handleMusicRequest(req, res) {
  const id = Number(req.query.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ code: 400, message: 'Missing or invalid music id', data: null });
    return;
  }

  try {
    const sources = getMusicSources(req.query.sources);
    const data = await match(id, sources);

    res.json({
      code: 200,
      message: 'success',
      data
    });
  } catch (error) {
    console.error(`Music match failed for id ${id}:`, error);
    res.status(500).json({
      code: 500,
      message: error instanceof Error ? error.message : 'Music match failed',
      data: null
    });
  }
}

async function start() {
  if (!fs.existsSync(indexHtml)) {
    throw new Error(`Renderer build not found: ${indexHtml}`);
  }

  ncmApiApp = await serveNcmApi({
    port: ncmApiPort,
    host: ncmApiHost,
    checkVersion: false
  });

  app.get('/healthz', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/music', handleMusicRequest);
  app.use('/api', proxyNcmApi);
  app.use(express.static(staticDir));

  app.get('*', (_req, res) => {
    res.sendFile(indexHtml);
  });

  webServer = app.listen(port, host, () => {
    console.log(`AlgerMusicPlayer web server running at http://${host}:${port}`);
    console.log(`Netease API proxy target: http://${ncmApiHost}:${ncmApiPort}`);
  });
}

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`);

  webServer?.close(() => {
    ncmApiApp?.server?.close(() => {
      process.exit(0);
    });
  });

  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
