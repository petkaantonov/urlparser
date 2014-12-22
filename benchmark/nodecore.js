var url = require('url');
var runBenchmark = require('./run-benchmark.js');
runBenchmark.url = url;
runBenchmark(url);
