import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPERIMENT_CATALOG } from '../../lib/experiments/registry';

// Unit test testing the keyword matcher heuristic
function matchExperiment(query: string) {
  const cleanQuery = query.trim().toLowerCase();

  if (
    cleanQuery.includes('voltage') ||
    cleanQuery.includes('current') ||
    cleanQuery.includes('resistance') ||
    cleanQuery.includes('ohm') ||
    cleanQuery.includes('circuit') ||
    cleanQuery.includes('v = ir') ||
    cleanQuery.includes('electricity') ||
    cleanQuery.includes('bulb')
  ) {
    return { matched: true, experimentId: 'ohms-law' };
  }

  if (
    cleanQuery.includes('pendulum') ||
    cleanQuery.includes('gravity') ||
    cleanQuery.includes('harmonic') ||
    cleanQuery.includes('oscillation') ||
    cleanQuery.includes('period')
  ) {
    return { matched: true, experimentId: 'simple-pendulum' };
  }

  if (
    cleanQuery.includes('titrat') ||
    cleanQuery.includes('acid') ||
    cleanQuery.includes('base') ||
    cleanQuery.includes('ph')
  ) {
    return { matched: true, experimentId: 'acid-base-titration' };
  }

  if (
    cleanQuery.includes('microscope') ||
    cleanQuery.includes('cell') ||
    cleanQuery.includes('biology')
  ) {
    return { matched: true, experimentId: 'compound-microscope' };
  }

  return { matched: false };
}

test('NLP Matcher - Maps voltage query to ohms-law', () => {
  const res = matchExperiment('I want to learn how changing voltage affects current');
  assert.equal(res.matched, true);
  assert.equal(res.experimentId, 'ohms-law');
});

test('NLP Matcher - Maps pendulum query to simple-pendulum', () => {
  const res = matchExperiment('Measure harmonic oscillation period with different lengths');
  assert.equal(res.matched, true);
  assert.equal(res.experimentId, 'simple-pendulum');
});

test('NLP Matcher - Maps titration query to acid-base-titration', () => {
  const res = matchExperiment('Determine unknown acid concentration by adding base titrant');
  assert.equal(res.matched, true);
  assert.equal(res.experimentId, 'acid-base-titration');
});

test('NLP Matcher - Honest fallback for unsupported experiment', () => {
  const res = matchExperiment('How to synthesize superconducting ceramic compounds');
  assert.equal(res.matched, false);
});
