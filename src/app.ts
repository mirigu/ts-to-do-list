import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log('서버실행~~');
});
