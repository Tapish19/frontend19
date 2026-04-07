import attendanceRoutes from './routes/MarkAttendanceUsingAI.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Attendance API is running',
    health: '/health',
  });
});

app.use(studentRoutes);
app.use(attendanceRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
};
import attendanceRoutes from './routes/MarkAttendanceUsingAI.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Attendance API is running',
    health: '/health',
  });
});

app.use(studentRoutes);
app.use(attendanceRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error' });
});

const start = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
};
