# Benchmark Visualization

I couldn't generate the PNG chart files directly in this environment, but here is the Python code using `matplotlib` to create them locally.

### How to Run

1.  Make sure you have Python installed.
2.  Install matplotlib: `pip install matplotlib`
3.  Save the code snippets below as a Python file (e.g., `generate_charts.py`) and run it: `python generate_charts.py`

---

### Chart A: Latency Distribution (p50, p90, p95) for REST vs. WebSocket Tests

This chart compares the response time latency for the REST API against the session length for the WebSocket test. It highlights that while REST API latency is low, the WebSocket test was measuring a different metric (session duration), so it's not a direct comparison of message latency.

```python
import matplotlib.pyplot as plt
import numpy as np

def generate_latency_chart():
    labels = ['p50', 'p90', 'p95']
    rest_latency = [52.3, 151.1, 241.6]
    ws_session_length = [1118.4, 1184.2, 1202.9]

    x = np.arange(len(labels))
    width = 0.35

    fig, ax = plt.subplots(figsize=(10, 6))
    rects1 = ax.bar(x - width/2, rest_latency, width, label='REST API Latency (ms)')
    rects2 = ax.bar(x + width/2, ws_session_length, width, label='WebSocket Session Length (ms)')

    ax.set_ylabel('Time (ms)')
    ax.set_title('API Latency (p50, p90, p95)')
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.legend()

    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)

    fig.tight_layout()
    plt.savefig('benchmarks/docs/charts/chart_a_latency_comparison.png')
    print("Chart A saved to benchmarks/docs/charts/chart_a_latency_comparison.png")

if __name__ == '__main__':
    generate_latency_chart()
```

### Chart B: Throughput and Error Rates Across Test Suites

This chart shows the throughput (in requests per second) and error rates for the different benchmark tests. It clearly indicates the high throughput and zero error rate of the REST API. Note that WebSocket throughput is not directly comparable as it measures messages sent over the test duration, not a request/response cycle.

```python
import matplotlib.pyplot as plt
import numpy as np

def generate_throughput_error_chart():
    labels = ['REST API', 'WebSocket', 'DB Benchmark']
    throughput = [101.38, 3.33, 0]  # WS throughput is ~200 messages / 60s = 3.33 msg/s. DB has no req/s metric.
    error_rates = [0, 0, 0]

    x = np.arange(len(labels))
    width = 0.35

    fig, ax1 = plt.subplots(figsize=(10, 6))

    # Bar chart for throughput
    color = 'tab:blue'
    ax1.set_xlabel('Test Suite')
    ax1.set_ylabel('Throughput (req/s)', color=color)
    bars = ax1.bar(x - width/2, throughput, width, label='Throughput', color=color)
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.bar_label(bars, fmt='%.1f')

    # Line chart for error rate on a secondary y-axis
    ax2 = ax1.twinx()
    color = 'tab:red'
    ax2.set_ylabel('Error Rate (%)', color=color)
    ax2.plot(x, error_rates, color=color, marker='o', linestyle='--', label='Error Rate (%)')
    ax2.tick_params(axis='y', labelcolor=color)
    ax2.set_ylim(-0.5, 5) # Set a small range for the 0% error rate

    fig.suptitle('Throughput and Error Rates by Test')
    fig.tight_layout()
    plt.savefig('benchmarks/docs/charts/chart_b_throughput_errors.png')
    print("Chart B saved to benchmarks/docs/charts/chart_b_throughput_errors.png")

if __name__ == '__main__':
    # You can call both functions from here if you combine the scripts
    # generate_latency_chart()
    generate_throughput_error_chart()

```
