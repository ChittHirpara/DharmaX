const { safetyMiddleware } = require('../middleware/safety');

// Mock express response object
function mockResponse() {
  const res = {};
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.jsonData = data;
    return this;
  };
  return res;
}

const testCases = [
  {
    message: "I feel stressed and tired.",
    shouldTrigger: false
  },
  {
    message: "I want to end my life, there is no hope.",
    shouldTrigger: true
  },
  {
    message: "I am having thoughts of suicide.",
    shouldTrigger: true
  },
  {
    message: "How can I stop self-harming?",
    shouldTrigger: true
  }
];

console.log("Running safety middleware tests...");

testCases.forEach((tc, idx) => {
  const req = { body: { message: tc.message } };
  const res = mockResponse();
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  safetyMiddleware(req, res, next);

  if (tc.shouldTrigger) {
    if (res.statusCode === 200 && res.jsonData && res.jsonData.isCrisis === true) {
      console.log(`✓ Test Case ${idx + 1} passed: Properly blocked crisis message`);
    } else {
      console.error(`❌ Test Case ${idx + 1} failed: Should have blocked crisis message but did not. Status: ${res.statusCode}`);
    }
  } else {
    if (nextCalled) {
      console.log(`✓ Test Case ${idx + 1} passed: Correctly ignored normal message`);
    } else {
      console.error(`❌ Test Case ${idx + 1} failed: Blocked normal message incorrectly`);
    }
  }
});
