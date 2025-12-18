import http from 'http';
import express from 'express';
import { initializeDatabase } from './database.js';
import { applyMiddleware, applyRoutes, middleware } from './middleware/route.js';
import { routes } from './service/index.routes.js';
import { validateToken } from './middleware/jwt.js';
import cors from 'cors';
import { initAssociations } from './entities/index.js';
import { initSocket } from './utils/socket.js';

process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception ${err.message}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Unhandled Rejection ${err}`);
});

// const res = new Date().getTimezoneOffset();
// if (res !== 0) {
//     console.log('Timezone is not in UTC . exiting.....');
//     process.exit(1);
// }

initAssociations();
await initializeDatabase();
export const app = express();

app.set('trust proxy', true);
app.use(cors({
    origin: '*'
}));
applyMiddleware(middleware, app);
app.use(validateToken);
applyRoutes(routes, app);
const port = process.env.PORT;


const server = http.createServer(app);
initSocket(server);

server.listen(port, () =>
    console.log(`API server is running on port ${port}`)
);

