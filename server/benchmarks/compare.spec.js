const { compare } = require('./compare');

describe('compare', () => {
  const thresholds = {
    metricA: { max: 100, tolerance: 0.1 },
    metricB: { max: 200, tolerance: 0.2 },
  };

  it('should not detect a regression when metrics are within tolerance', () => {
    const baseline = { metricA: 50, metricB: 100 };
    const current = { metricA: 55, metricB: 110 };
    const report = compare(baseline, current, thresholds);
    expect(report.isRegression).toBe(false);
  });

  it('should detect a regression when a metric exceeds tolerance', () => {
    const baseline = { metricA: 50, metricB: 100 };
    const current = { metricA: 56, metricB: 110 };
    const report = compare(baseline, current, thresholds);
    expect(report.isRegression).toBe(true);
  });

  it('should detect a regression when a metric exceeds the max value', () => {
    const baseline = { metricA: 90, metricB: 100 };
    const current = { metricA: 101, metricB: 110 };
    const report = compare(baseline, current, thresholds);
    expect(report.isRegression).toBe(true);
  });

  it('should handle nested metric values', () => {
    const baseline = { metricA: { value: 50 }, metricB: { value: 100 } };
    const current = { metricA: { value: 56 }, metricB: { value: 110 } };
    const report = compare(baseline, current, thresholds, 'value');
    expect(report.isRegression).toBe(true);
  });
});
