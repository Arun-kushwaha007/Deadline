#!/bin/bash
set -e

SERVE_PATH="./node_modules/.bin/serve"
LOG_FILE=$(mktemp)

# Start server and capture output
$SERVE_PATH -s dist > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

sleep 5

# Extract dynamic served URL
SERVED_URL=$(grep -oE "http://localhost:[0-9]+" "$LOG_FILE" | head -n 1)

if [ -z "$SERVED_URL" ]; then
  echo "❌ Could not detect local server URL"
  cat "$LOG_FILE"
  kill $SERVER_PID
  exit 1
fi

export SERVED_URL
echo "✅ SERVED_URL = $SERVED_URL"

# Benchmark user credentials (the one you created)
export BENCH_EMAIL="benchmark@demo.local"
export BENCH_PASSWORD="benchmark123"

# ✅ Create logged-in session before benchmarks
node benchmarks/lighthouse/save-session.js

# ✅ Run Lighthouse audits using logged-in session
node benchmarks/lighthouse/playwright-run.js

# Cleanup
kill $SERVER_PID
rm "$LOG_FILE"
