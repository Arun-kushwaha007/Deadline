import json
import pandas as pd
import matplotlib.pyplot as plt

# Load reports from the *actual folder you're running in*
with open('artillery-baseline.json') as f:
    baseline = json.load(f)

with open('artillery-ws.json') as f:
    ws = json.load(f)

# Extract metrics for HTTP test
def extract_http_metrics(data):
    agg = data["aggregate"]
    summary = agg["summaries"]["http.response_time"]

    p50 = summary["p50"]
    p90 = summary["p90"]
    p95 = summary["p95"]

    created = agg["counters"].get("vusers.created", 0)
    failed = agg["counters"].get("vusers.failed", 0)
    error_rate = (failed / created * 100) if created > 0 else 0

    throughput = agg["rates"].get("http.request_rate", 0)

    return p50, p90, p95, error_rate, throughput

# Extract metrics for WebSocket test
def extract_ws_metrics(data):
    agg = data["aggregate"]
    summary = agg["summaries"]["socketio.response_time"]

    p50 = summary["p50"]
    p90 = summary["p90"]
    p95 = summary["p95"]

    created = agg["counters"].get("vusers.created", 0)
    failed = agg["counters"].get("vusers.failed", 0)
    error_rate = (failed / created * 100) if created > 0 else 0

    throughput = agg["rates"].get("socketio.emit_rate", 0)

    return p50, p90, p95, error_rate, throughput

baseline_metrics = extract_http_metrics(baseline)
ws_metrics = extract_ws_metrics(ws)

# Build comparison DataFrame
df = pd.DataFrame([
    ["HTTP (REST)", *baseline_metrics],
    ["WebSocket", *ws_metrics]
], columns=["Protocol", "p50", "p90", "p95", "Error Rate (%)", "Throughput (req/s)"])

print(df)

# Plot chart
df.set_index("Protocol")[["p50", "p90", "p95"]].plot(kind="bar", figsize=(8,6))
plt.title("Latency Comparison (Lower is better)")
plt.ylabel("Milliseconds")
plt.show()
