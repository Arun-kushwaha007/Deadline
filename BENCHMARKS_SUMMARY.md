# CollabNest — Performance & Benchmarking Report

## Executive Summary

This report presents comprehensive performance benchmarking results for CollabNest across backend (HTTP & WebSocket), database layer, and frontend components. The analysis identifies critical bottlenecks under load and provides a prioritized optimization roadmap.

**Key Finding:** The database and WebSocket layers perform exceptionally well (sub-millisecond latency), while HTTP endpoints exhibit significant tail latency under concurrent load, particularly for authentication and resource creation operations.

---

## 🎯 TL;DR

WebSocket handling is extremely fast (sub-ms p50/p95), but HTTP auth/task endpoints show high tail latency under load:
- **p50:** 320ms to 4s (depending on load pattern)
- **p95:** Up to 5.6s under heavy concurrent load
- **Autocannon spike test:** Average latency ≈ 6.7s with 50% of requests > 4.8s

**Database operations remain sub-millisecond** — the bottleneck is clearly in the HTTP request handling layer, not data access.

**Recommendation:** Prioritize reducing HTTP tail latency by eliminating synchronous/blocking work, implementing horizontal scaling, and adding strategic caching.

---

## 🛠 Tooling & Methodology

### Performance Testing Stack

| Tool | Purpose | Target |
|------|---------|--------|
| **Artillery** | Scenario-driven load testing | REST API & WebSocket events |
| **Autocannon** | Aggressive stress testing | Spike & sustained load patterns |
| **Custom DB Microbench** | Per-operation latency measurement | MongoDB CRUD operations |
| **Lighthouse (Playwright)** | Frontend performance audit | Page load & rendering metrics |

---

## 📊 High-Level Results

### Database Layer
✅ **Excellent Performance**
- All core MongoDB operations: **sub-millisecond** (mean ~0.1–0.2ms)
- No indexing issues detected
- 0% error rate across all operations

### WebSocket Layer
✅ **Excellent Performance**
- Event round-trip latency: **0.1–0.5ms**
- p50: 0.1ms, p90: 0.2ms, p95: 0.4–0.5ms
- Highly efficient for real-time features

### HTTP Layer
⚠️ **Critical Bottleneck**
- Significant slowdown under concurrency
- p90–p95 latency in **seconds** under heavy load
- Frequent timeouts and 409 conflicts
- **Problem endpoints:**
  - `/api/auth/login`
  - `/api/organizations/create`
  - `/api/tasks` (creation)

---

## 📈 Detailed Performance Metrics

### Frontend Performance (Lighthouse)

| Page | Performance Score | Notes |
|------|-------------------|-------|
| Login | 88 | Slight delay from network + auth round trip |
| Register | 100 | Fully optimized render path |
| Dashboard | 100 | Excellent hydration strategy |
| Tasks View | 98 | Fast UI with stable state updates |

**Analysis:** Frontend rendering is well-optimized and not contributing to performance issues.

---

### HTTP Load Testing (Artillery)

#### Mixed Workflow Scenario
Login → Organization Create → Task Create/Update/List

| Metric | Latency |
|--------|---------|
| p50 | ~600ms |
| p90 | ~4.5s |
| p95 | ~5.6s |
| p99 | ~8.5s |

**Critical Issue:** The tail latencies (p90+) represent severe UX degradation.

#### Endpoint-Specific Results

**`/api/auth/login`** (Heavy Load)
- Mean: ~4.5s
- p50: ~4.3s
- p90: ~5.6s

**Request Rate:** ~30 req/s observed throughput
**Total Requests:** ~10,200 across extended test run

#### Error Patterns
- **HTTP 409 (Conflict):** During concurrent organization creation
- **HTTP 404:** Intermittent during scenario flows
- **Failed Captures:** Test expectations not met due to slow responses

---

### WebSocket Testing (Artillery)

| Metric | Latency |
|--------|---------|
| p50 | 0.1ms |
| p90 | 0.2ms |
| p95 | 0.4–0.5ms |

**Emit Rate:** ~10 emits/sec in steady state

**Verdict:** ✅ WebSocket subsystem is production-ready with excellent performance.

---

### Stress Testing (Autocannon)

#### Spike Test (200 concurrent connections, 30s)
```
Total Requests:  817
Successful (200): 194
Timeouts/Errors:  423 (52%)

Latency:
  Average:  6.7s
  p50:      4.8s
  p90:      9.4s
  Max:      9.7s
```

#### Sustained Load (50 concurrent connections, 120s)
```
Total Requests:  2,000
Successful (2xx): 1,554
Timeouts/Errors:  100 (5%)

Latency:
  Average:  3.1s
  p50:      3.0s
  p90:      3.6s
  Max:      6.2s
```

**Analysis:** Server cannot handle concurrent synchronous operations efficiently. High timeout rate indicates resource starvation or blocking operations.

---

### Database Microbenchmark (1,000 iterations)

| Operation | Mean (ms) | p50 (ms) | p95 (ms) | p99 (ms) | Error Rate |
|-----------|-----------|----------|----------|----------|------------|
| Find Org for User | 0.196 | 0.125 | 0.48 | 1.14 | 0% |
| List Tasks (paginated) | 0.149 | 0.104 | 0.29 | 0.55 | 0% |
| Create Task | 0.118 | 0.089 | 0.29 | — | 0% |
| Update Task | 0.099 | 0.074 | 0.22 | — | 0% |

**Verdict:** ✅ MongoDB is NOT the bottleneck. Database layer is well-optimized.

---

## 🔍 Root Cause Analysis

### What This Really Means

**The performance bottleneck is NOT:**
- ❌ MongoDB queries or indexing
- ❌ WebSocket event handling
- ❌ Frontend rendering

**The performance bottleneck IS:**
- ✅ High load on synchronous work in Node.js request path
- ✅ Blocking CPU operations (likely bcrypt password hashing)
- ✅ Inline notification/Firebase processing
- ✅ Lack of caching for repeated lookups
- ✅ Single Node.js process without horizontal scaling
- ✅ Non-idempotent organization creation causing race conditions

---

## 🚀 Optimization Plan

### Priority 1: Fix HTTP Hot Path (CRITICAL)
**Impact:** Direct improvement to user experience and scalability

#### 1.1 Profile & Trace Request Lifecycle
- Implement request tracing (OpenTelemetry or debug spans)
- Target endpoints: `/api/auth/login`, `/api/organizations/create`, `/api/tasks`
- Measure time spent in:
  - Authentication (JWT sign/verify)
  - Database queries
  - Password hashing
  - Third-party API calls (Firebase)
  - Input validation

**Tools:** Use `clinic doctor`, `0x`, or `clinic flame` to identify blocking CPU tasks

#### 1.2 Remove Blocking Operations
- **Switch to async bcrypt** or move password hashing to worker queue
- **Offload Firebase/notification calls** to background job processor (BullMQ + Redis)
- **Eliminate synchronous logging** or heavy CPU transforms from request path

**Expected Impact:** 30-70% reduction in p50 latency

#### 1.3 Implement Strategic Caching
- **Redis caching** for:
  - User session validations (1-5 min TTL)
  - Organization lookups
  - Common query results
- **JWT verification:** Verify tokens locally, only query DB when necessary
- **Rate limiting keys:** Use Redis for deduplication in org creation

**Expected Impact:** Additional 20-40% improvement for cached operations

#### 1.4 Make Organization Creation Idempotent
- Add **unique index** on `organization.name` per owner
- Implement proper conflict handling for 409 responses
- Use DB upsert patterns where appropriate
- Handle race conditions with retry logic

#### 1.5 Horizontal Scaling
- Deploy multiple Node.js instances (PM2 or Kubernetes)
- Add nginx or HAProxy load balancer
- Ensure application is stateless (JWT-based sessions)
- Configure MongoDB connection pooling for expected concurrency

**Expected Impact:** Linear throughput scaling with instance count

#### 1.6 Production Environment Tuning
- Set `NODE_ENV=production`
- Increase `ulimit` for file descriptors
- Tune kernel TCP settings for high concurrency
- Optimize connection keepalive settings

---

### Priority 2: Fix Test Data & Harness
**Impact:** Reliable performance metrics and CI/CD integration

- Use **unique organization names** per virtual user (randomization)
- Pre-create test organizations to avoid 409s
- Add defensive checks in test flows (handle 409 → GET existing org)
- Validate payload CSV structure (`benchmarks/artillery/users.csv`)
- Ensure proper error handling in Artillery scenarios

---

### Priority 3: Observability & Resilience
**Impact:** Proactive issue detection and faster debugging

- **Metrics:** Implement Prometheus exporters for:
  - Request duration histograms
  - Error rates by endpoint
  - Database query latencies
  - Queue lengths (if using BullMQ)
- **Alerting:** Set thresholds for p95 latency and error rates
- **Structured logging:** JSON format with request correlation IDs
- **Distributed tracing:** Implement spans across service boundaries

---

### Priority 4: Frontend Optimizations (Lower Priority)
**Impact:** Improved perceived performance

- Leverage client-side caching strategies
- Implement lazy loading for heavy components
- Add skeleton screens during data loading
- Maintain current Lighthouse scores (already excellent)

---

## 📋 Running the Benchmarks

```bash
# Navigate to server directory
cd server

# Run Artillery tests
npm run bench:artillery

# Run Autocannon stress tests
npm run bench:autocannon

# Run database microbenchmarks
npm run bench:db

# Run Lighthouse audits (requires Playwright)
npm run bench:lighthouse
```

---
<!-- 
## 📝 Interview-Ready Explanation

> "I performed comprehensive load testing on CollabNest and discovered that while our database and WebSocket layers perform exceptionally well—with sub-millisecond latencies—our HTTP endpoints show significant tail latency under concurrent load, particularly for authentication and resource creation.
>
> The p95 latency reaches 5+ seconds under heavy load, with the database consistently performing at sub-millisecond speeds. This clearly identifies the bottleneck as synchronous work in the Node.js event loop, likely password hashing and inline notification processing.
>
> My optimization plan prioritizes the user-facing pain points: first, I'll add request tracing to quantify exact bottlenecks, then move blocking operations to async worker queues, implement Redis caching for repeated lookups, and finally scale horizontally with multiple Node instances behind a load balancer. This approach directly targets the p90/p95 latency that impacts user experience."

--- -->

## 🎯 Success Metrics

After implementing Priority 1 optimizations, target metrics:

| Metric | Current | Target |
|--------|---------|--------|
| Login p50 | 4.3s | <500ms |
| Login p95 | 5.6s | <1s |
| Org Create p50 | ~600ms | <200ms |
| Timeout Rate | 52% (spike) | <1% |
| Concurrent Users | ~50 stable | 200+ stable |

---

## 📚 Appendix

### Test Artifacts Location
- Artillery reports: `benchmarks/artillery/results/`
- Autocannon logs: `benchmarks/autocannon/results/`
- DB benchmark data: `benchmarks/db-bench.json`
- Lighthouse reports: `benchmarks/lighthouse/reports/`

