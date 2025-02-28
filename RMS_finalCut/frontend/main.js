import dotenv from 'dotenv';

import { httpx, expressx } from 'ca-webutils'

import express from 'express';

import path from 'path'

import { createRequestHandler } from 'react-router-dom';

import { publicIpv4 } from 'public-ip';





dotenv.config();

const app = express();

let staticPath = path.join(process.cwd(), 'dist');

app.use(express.static(staticPath));

app.get('/ip', async (req, res) => {

    let ip = await publicIpv4();

    res.json({ ip });

})

app.get('*', async (req, res) => {

    res.sendFile(path.join(staticPath, 'index.html'));

});

httpx.runApp({

    requestHandler: app

});

