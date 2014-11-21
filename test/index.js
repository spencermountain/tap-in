var parser = require('../');
var test = require('tape');

test('output event', function (t) {
  
  t.plan(1);
  
  var mockTap = [
    '# is true',
    'ok 1 true value',
    'ok 2 true value'
  ];
  
  var p = parser();
  
  p.on('output', function (output) {
    
    t.deepEqual(output, {
      asserts: [
        { name: 'true value', number: 1, ok: true, raw: 'ok 1 true value', test: 1, type: 'assert' }, 
        { name: 'true value', number: 2, ok: true, raw: 'ok 2 true value', test: 1, type: 'assert' }
      ],
      fail: [],
      pass: [ 
        { name: 'true value', number: 1, ok: true, raw: 'ok 1 true value', test: 1, type: 'assert' },
        { name: 'true value', number: 2, ok: true, raw: 'ok 2 true value', test: 1, type: 'assert' }
      ],
      results: [],
      tests: [
        { name: 'is true', number: 1, raw: '# is true', type: 'test' }
      ],
      versions: []
    }, 'output data');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('output callback', function (t) {
  
  t.plan(1);
  
  var mockTap = [
    '# is true',
    'ok 1 true value',
    'ok 2 true value'
  ];
  
  var p = parser(function (err, output) {
    
    t.deepEqual(output, {
      asserts: [
        { name: 'true value', number: 1, ok: true, raw: 'ok 1 true value', test: 1, type: 'assert' }, 
        { name: 'true value', number: 2, ok: true, raw: 'ok 2 true value', test: 1, type: 'assert' }
      ],
      fail: [],
      pass: [ 
        { name: 'true value', number: 1, ok: true, raw: 'ok 1 true value', test: 1, type: 'assert' },
        { name: 'true value', number: 2, ok: true, raw: 'ok 2 true value', test: 1, type: 'assert' }
      ],
      results: [],
      tests: [
        { name: 'is true', number: 1, raw: '# is true', type: 'test' }
      ],
      versions: []
    }, 'output data');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('tests', function (t) {
  
  t.plan(1);
  
  var mockTap = [
    '# is true',
    'ok 1 true value',
    'ok 2 true value'
  ];
  
  var p = parser();
  
  p.on('test', function (test) {
    
    t.deepEqual(test, {
      type: 'test',
      name: 'is true',
      raw: '# is true',
      number: 1
    }, 'test is parsed');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('asserts', function (t) {
  
  t.plan(2);
  
  var mockTap = [
    '# is true',
    'ok 1 true value',
    'ok 2 true value'
  ];
  
  var p = parser();
  
  var asserts = [];
  p.on('assert', function (assert) {
    asserts.push(assert);
  });
  
  p.on('output', function () {
    
    t.deepEqual(asserts[0], {
      name: 'true value',
      number: 1,
      ok: true,
      raw: 'ok 1 true value',
      test: 1,
      type: 'assert'
    }, 'assert 1')
    t.deepEqual(asserts[1], {
      name: 'true value',
      number: 2,
      ok: true,
      raw: 'ok 2 true value',
      test: 1,
      type: 'assert'
    }, 'assert 2')
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('results', function (t) {
  
  t.plan(3);
  
  var mockTap = [
    '# tests 15',
    '# pass  13',
    '# fail  2'
  ];
  
  var p = parser();
  
  var results = [];
  p.on('result', function (result) {
    results.push(result);
  });
  
  p.on('output', function () {
    
    t.deepEqual(results[0], {
      count: '15',
      name: 'tests',
      raw: '# tests 15',
      type: 'result' 
    }, 'tests');
    
    t.deepEqual(results[1], {
      count: '13',
      name: 'pass',
      raw: '# pass  13',
      type: 'result'
    }, 'pass');
    
    t.deepEqual(results[2], {
      count: '2',
      name: 'fail',
      raw: '# fail  2',
      type: 'result'
    }, 'fail');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('version', function (t) {
  
  t.plan(1);
  
  var mockTap = [
    'TAP version 13'
  ];
  
  var p = parser();
  
  var results = [];
  p.on('version', function (version) {
    
    t.deepEqual(version, {
      raw: 'TAP version 13',
      type: 'version'
    }, 'version data');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('pass', function (t) {
  
  t.plan(2);
  
  var mockTap = [
    '# is true',
    'ok 1 true value',
    'ok 2 true value'
  ];
  
  var p = parser();
  
  var passes = [];
  p.on('pass', function (pass) {
    
    passes.push(pass);
  });
  
  p.on('output', function () {
    
    t.deepEqual(passes[0], {
      name: 'true value',
      number: 1,
      ok: true,
      raw: 'ok 1 true value',
      test: 1,
      type: 'assert'
    }, 'pass 1');
    
    t.deepEqual(passes[1], {
      name: 'true value',
      number: 2,
      ok: true,
      raw: 'ok 2 true value',
      test: 1,
      type: 'assert'
    }, 'pass 2');
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});

test('fail', function (t) {
  
  t.plan(1);
  
  var mockTap = [
    "TAP version 13",
    "# is true",
    "ok 1 true value",
    "ok 2 true value",
    "not ok 3 strings match",
    "  ---",
    "    operator: equal",
    "    expected: 'you'",
    "    actual:   'me'",
    "    at: Test.<anonymous> (/Users/scott/www/divshot/divshot-cli/test/index.js:8:5)",
    "  ..."
  ];
  
  var fails = [];
  var p = parser(function () {
    
    t.deepEqual(fails[0], {
      error: {
        actual:'me',
        expected:'you',
        operator: 'equal',
        at: {
          charactor: '5',
          file: '/Users/scott/www/divshot/divshot-cli/test/index.js',
          line: '8'
        }
      },
      name: 'strings match',
      number: 3,
      ok: false,
      raw: 'not ok 3 strings match',
      test: 1,
      type: 'assert'
    }, 'fail');
  });
  
  p.on('fail', function (fail) {
    
    fails.push(fail);
  });
  
  mockTap.forEach(function (line) {
    
    p.write(line + '\n');
  });
  p.end();
});