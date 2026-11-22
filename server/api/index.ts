// Vercel serverless entry: exports the Express app instead of calling app.listen().
import { createApp } from '../src/app';

export default createApp();
