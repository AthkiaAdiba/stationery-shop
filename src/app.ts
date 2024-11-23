import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { productRouters } from './modules/products/product.route';
import { orderRouters } from './modules/order/order.route';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// application routes
app.use('/api/products', productRouters);
app.use('/api/orders', orderRouters);

app.get('/', (req: Request, res: Response) => {
  res.send('Stationery Server is running');
});

export default app;
