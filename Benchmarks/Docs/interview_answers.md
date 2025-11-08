Critical Finding: Optimizing for unknown spike load conditions is the highest priority, as it represents the biggest risk to production stability.

### How can you optimize your project? What part will you optimize first, how, and why?

My first priority isn't to optimize existing code, but to optimize our *observability*. Our biggest blind spot is the lack of spike and stress test data, which poses a significant risk to production stability. Here’s my prioritized plan:

1.  **What:** **Implement proper spike testing for the REST API.**
    *   **Why:** Our current tests only cover sustained, predictable load. We have no data on how the system behaves during a sudden traffic burst (e.g., a flash sale, a login storm). This is where systems often break. User journeys like login and registration are most at risk.
    *   **How:** I will script a realistic spike test using **Autocannon**, configuring it to ramp up virtual users aggressively and, critically, to save the output as a parsable JSON file. This will become a required part of our CI pipeline.
    *   **Metrics to Track:** My primary KPIs will be **p95 latency** and **error rate (%)**. The goal is to find the throughput limit where these metrics start to degrade unacceptably.
    *   **Rollback Criteria:** This is for testing, not a code change. However, once we have a baseline, any future code change that causes the error rate to exceed 1% or p95 latency to increase by more than 20% under the spike test would be immediately reverted.

2.  **What:** **Improve WebSocket benchmark to measure message latency.**
    *   **Why:** For a real-time app, connection stability is just the start. The user experience depends on low-latency message delivery. Our current test doesn't measure this at all.
    *   **How:** I will update the Artillery WebSocket script to include a request-response flow, where each virtual user sends a message and waits for an echo. This will allow us to measure the round-trip **message latency**.
    *   **Metrics to Track:** The key metric will be **p95 message latency**. We should aim to keep this under 300ms to feel "real-time."

Only after establishing these crucial benchmarks would I move on to code-level optimizations, likely starting with the tail latency (p95) on the REST API.

---

### 5 Follow-Up Interview Questions

**1. How do you measure the success of an optimization?**

I measure success by comparing hard numbers against a pre-defined goal, using the exact same test scenario before and after the change. For example, if I'm optimizing an endpoint to reduce tail latency, success would be a concrete, measurable reduction in the **p95 latency** by a target percentage (e.g., 20%) while ensuring the **error rate** remains at 0% and **throughput** doesn't decrease. Success isn't just about making one number better; it's about ensuring the overall health of the system doesn't degrade.

**2. After implementing a fix for a performance issue, how would you load test it?**

I'd run two distinct tests. First, I'd rerun the *exact same* load test scenario that initially revealed the problem. This is to confirm, apples-to-apples, that the fix has solved the specific issue. Second, I'd run a stress test at **120%-150% of the original load**. This helps verify that my fix is robust and hasn't just moved the bottleneck a little further down the road. It ensures we've actually increased the system's capacity.

**3. You mentioned the database performance is good, but how would you ensure a database schema change is safe from a performance perspective?**

I'd tackle this in three steps. First, in a staging environment with production-scale data, I'd use `EXPLAIN` to analyze the query plans for our top 5-10 most critical queries before and after the schema change. I'd be looking for any changes that introduce full table scans or less efficient index usage. Second, I'd run our existing database microbenchmark to ensure raw query performance hasn't regressed. Finally, I'd run the full end-to-end Artillery load test, as some performance issues only surface through the application's interaction with the database.

**4. What’s a potential “quick win” for optimization on this project versus a longer-term fix?**

A **quick win** would be to fix the accessibility issues on the login page, which scored an 85 in our Lighthouse audit. These are often straightforward fixes like adding ARIA attributes or adjusting color contrast, can be done quickly, and have a high impact on usability for some users.

A **longer-term fix** would be investigating the significant gap between median (p50) and tail (p95) latency in our REST API (52ms vs. 242ms). This discrepancy suggests a complex issue, possibly related to Node.js event loop blocking, garbage collection pauses, or inefficient code paths in specific controllers that require deeper profiling to diagnose and solve.

**5. You've identified a lack of spike testing as a major risk. What's the very first action you would take to address this?**

My first action would be to **define and script a single, realistic spike test scenario** using Autocannon. I'd start with the login endpoint, as it's a common target for bursty traffic. The immediate goal wouldn't be to find a bottleneck, but to run the test and **establish an initial baseline**. This gives us the first-ever data point for spike performance and a concrete benchmark to measure all future changes against.
