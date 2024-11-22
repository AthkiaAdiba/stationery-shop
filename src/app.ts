import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { routers } from './modules/products/product.route';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/', routers);

app.get('/', (req: Request, res: Response) => {
  res.send('Stationery Server is running');
});

export default app;
