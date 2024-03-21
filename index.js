import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import chalk from 'chalk'
import cors from 'cors';
import express from 'express'
import initApp from './src/index.router.js'


const port = process.env.PORT || 5000
const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })

// const corsOptions = {
// 	origin: 'http://localhost:5174',
//   };
  
  app.use(cors(/* corsOptions */));
app.set('case sensitive routing',true);
app.use('/uploads', express.static('./src/uploads'));

initApp(app ,express)
app.listen(port, () => console.log(chalk.magentaBright(`Example app listening on port ${port}!`))) 