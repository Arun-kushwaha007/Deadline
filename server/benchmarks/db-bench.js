const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'collabnest';
const ITERATIONS = parseInt(process.env.ITERATIONS, 10) || 1000;
const REPORT_DIR = path.join(__dirname, 'reports');
const REPORT_PATH = path.join(REPORT_DIR, 'db-bench.json');

async function runDbBenchmarks() {
  const client = new MongoClient(MONGO_URI);
  const results = {};

  try {
    await client.connect();
    console.log('Connected to MongoDB for benchmarking.');
  } catch (error) {
    console.warn('Could not connect to MongoDB. Skipping DB benchmarks.', error.message);
    return;
  }

  const db = client.db(DB_NAME);
  const tasksCollection = db.collection('tasks');
  const orgsCollection = db.collection('organizations');

  const orgId = new ObjectId();
  const userId = new ObjectId().toHexString();
  const taskId = new ObjectId();

  await orgsCollection.insertOne({ _id: orgId, name: 'Benchmark Org', members: [{ userId }] });
  await tasksCollection.insertOne({ _id: taskId, title: 'Benchmark Task', organization: orgId });

  const benchmarks = [
    { name: 'Find Org for User', fn: () => orgsCollection.findOne({ 'members.userId': userId }) },
    { name: 'List Tasks (Paginated)', fn: () => tasksCollection.find({ organization: orgId }).limit(20).toArray() },
    { name: 'Create Task', fn: () => tasksCollection.insertOne({ title: 'New Task', organization: orgId }) },
    { name: 'Update Task', fn: () => tasksCollection.updateOne({ _id: taskId }, { $set: { status: 'in-progress' } }) },
  ];

  for (const bench of benchmarks) {
    results[bench.name] = await runBenchmark(bench.name, bench.fn);
  }

  await orgsCollection.deleteOne({ _id: orgId });
  await tasksCollection.deleteMany({ organization: orgId });

  await client.close();
  console.log('MongoDB connection closed.');

  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR);
  }
  fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
  console.log(`DB benchmark report written to ${REPORT_PATH}`);
}

async function runBenchmark(name, benchmarkFn) {
  const latencies = [];
  let errors = 0;

  console.log(`Running benchmark: "${name}" for ${ITERATIONS} iterations...`);

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    try {
      await benchmarkFn();
      const end = performance.now();
      latencies.push(end - start);
    } catch (error) {
      errors++;
    }
  }

  return calculateResults(latencies, errors);
}

function calculateResults(latencies, errors) {
  if (latencies.length === 0) {
    return { error: 'No data to report.' };
  }

  latencies.sort((a, b) => a - b);
  const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p90 = latencies[Math.floor(latencies.length * 0.9)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  const errorRate = (errors / ITERATIONS) * 100;

  return {
    mean_latency_ms: parseFloat(mean.toFixed(3)),
    p50_latency_ms: parseFloat(p50.toFixed(3)),
    p90_latency_ms: parseFloat(p90.toFixed(3)),
    p95_latency_ms: parseFloat(p95.toFixed(3)),
    p99_latency_ms: parseFloat(p99.toFixed(3)),
    error_rate_percent: parseFloat(errorRate.toFixed(2)),
  };
}

runDbBenchmarks().catch(console.error);
