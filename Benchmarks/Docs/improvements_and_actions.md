Critical Finding: The highest priority is to implement spike testing to uncover how the system behaves under sudden, high-stress loads, which is our biggest production risk.

Here is my prioritized list of improvements based on the benchmark results. I've scored them using ICE (Impact x Confidence x Ease, with Ease scored 1-5 where 5 is lowest effort) to determine the most effective order of operations.

### 1. Implement API Spike Testing (ICE Score: 100)

*   **Description:** I will script and execute a proper spike test using Autocannon against our key API endpoints (e.g., `/login`, `/register`). This is our biggest blind spot and represents a major risk to production stability.
*   **Impact: 5/5** - This is critical. Without this data, we are flying blind into any high-traffic event and risk a full system outage.
*   **Confidence: 5/5** - I am 100% confident this will give us our first real data on the system's breaking point.
*   **Ease: 4/5** - The effort is low as it only requires scripting the test and integrating it into CI, with no changes to the application code.
*   **Timeline:** **0–2 weeks**
*   **Expected Impact:** Establish the maximum requests per second the system can handle in a burst. The first goal is to simply get this number, and then improve it.
*   **Risk / Rollback Plan:** Zero production risk. This is a testing-only change. If the CI job is unstable, it can be temporarily disabled without affecting anything.
*   **Getting Started:**
    ```bash
    # Command to run a spike test for 20 seconds with 500 concurrent connections and save results
    autocannon -c 500 -d 20 http://localhost:3000/api/login --json > server/benchmarks/reports/autocannon-spike.json
    ```

### 2. Fix Frontend Accessibility on Login Page (ICE Score: 75)

*   **Description:** I will address the specific accessibility issues flagged by the Lighthouse audit on the `/login` page to increase the score from 85 to over 95.
*   **Impact: 3/5** - This is a high-impact fix for users with disabilities and is crucial for an inclusive user experience.
*   **Confidence: 5/5** - Lighthouse provides clear, actionable recommendations that are straightforward to implement.
*   **Ease: 5/5** - The effort is very low. Most fixes will likely involve adding ARIA attributes or adjusting CSS.
*   **Timeline:** **0–2 weeks**
*   **Expected Impact:** Increase the Lighthouse accessibility score for the `/login` page from 85 to >95.
*   **Risk / Rollback Plan:** Very low risk. These are typically minor HTML/CSS changes that are easy to verify and revert if necessary.
*   **Getting Started (Example fix for an unlabeled button):**
    ```diff
    - <button class="close-icon"></button>
    + <button aria-label="Close dialog" class="close-icon"></button>
    ```

### 3. Improve WebSocket Performance Benchmarking (ICE Score: 60)

*   **Description:** I will update the Artillery WebSocket test to measure what truly matters for a real-time application: end-to-end message latency.
*   **Impact: 4/5** - This is key to the core user experience. Without this, we can't be sure our real-time features are actually "real-time."
*   **Confidence: 5/5** - This is a standard load-testing pattern for WebSockets and I am certain it will produce the latency metrics we need.
*   **Ease: 3/5** - This requires rewriting the Artillery YAML scenario and adding a small custom JavaScript function, but no application code changes.
*   **Timeline:** **0–2 weeks**
*   **Expected Impact:** Establish a baseline for p95 message latency. My initial goal will be to keep this metric under 300ms.
*   **Risk / Rollback Plan:** No production risk. The test script changes can be reverted without consequence.
*   **Getting Started (Artillery scenario pseudo-code):**
    ```yaml
    # In artillery-ws.yml
    scenarios:
      - flow:
        - log: "Pinging server..."
        - send: '{"action": "ping", "sentAt": {{$timestamp}}}'
        # Expect a "pong" response and use a custom function to calculate latency
        - expect:
            - function: "calculateLatency" 
    ```

### 4. Investigate REST API Tail Latency (ICE Score: 24)

*   **Description:** I will perform a deep-dive analysis and profiling of the Node.js backend to understand why the p95 latency (241.6ms) is nearly 5x the p50 latency (52.3ms).
*   **Impact: 4/5** - Fixing this will improve the experience for the 5% of users getting the slowest responses, leading to better overall user satisfaction.
*   **Confidence: 3/5** - I'm confident I can identify the cause, but such issues can be complex (e.g., event loop blocking, GC pauses), so the fix may not be simple.
*   **Ease: 2/5** - This is a high-effort task that requires specialized tooling (like `clinic.js`), generating flamegraphs, and careful analysis.
*   **Timeline:** **2–8 weeks**
*   **Expected Impact:** Reduce API p95 latency by at least 30%, bringing it from ~240ms down to below 170ms under the same load.
*   **Risk / Rollback Plan:** Any code change will be managed via a pull request. The rollback plan is to revert the change if post-deployment monitoring or re-running the benchmark shows any regression.
*   **Getting Started:**
    ```bash
    # Use clinic.js to profile the application under load
    clinic doctor --on-port 'autocannon http://localhost:3000' -- node server/index.js
    ```
