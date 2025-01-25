import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// application routes
app.use('/api', router);

const test = async (req: Request, res: Response) => {
  res.send('Stationery Server is running');
};

app.get('/', test);

app.use(globalErrorHandler);

// NOT Found
app.use(notFound);

export default app;

// import express, { Application, Request, Response } from 'express';
// import cors from 'cors';
// import { productRouters } from './app/modules/products/product.route';
// import { orderRouters } from './app/modules/order/order.route';
// const app: Application = express();

// // parser
// app.use(express.json());
// app.use(cors());

// // application routes
// app.use('/api/products', productRouters);
// app.use('/api/orders', orderRouters);

// app.get('/', (req: Request, res: Response) => {
//   res.send('Stationery Server is running');
// });

// export default app;
