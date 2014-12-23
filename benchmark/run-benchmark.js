
module.exports = runBenchmark;


var n = 25 * 100;

var urls = [
    'http://nodejs.org/docs/latest/api/url.html#url_url_format_urlobj',
    'http://blog.nodejs.org/',
    'https://encrypted.google.com/search?q=url&q=site:npmjs.org&hl=en',
    'javascript:alert("node is awesome");',
    'some.ran/dom/url.thing?oh=yes#whoo'
];

var paths = [
    '../foo/bar?baz=boom',
    'foo/bar',
    'http://nodejs.org',
    './foo/bar?baz'
];

function runBenchmark(url) {
    // Lazy evaluation vs eager evaluation is unfair, let's read
    // the properties from the result.
    benchmark('parse()', benchmarkParse);
    benchmark('format()', benchmarkFormat);
    paths.forEach(function(p) {
        benchmark('resolve("' + p + '")', function() {
            benchmarkResolve(p);
        });
    });
}

function benchmarkParse() {
    var _urls = urls;
    var _n = n;
    var url = runBenchmark.url;
    for (var i = 0; i < _n; ++i) {
        for (var j = 0, k = _urls.length; j < k; ++j) {
            var result = url.parse(_urls[j]);
            if (result.query === false) die;
            if (result.href === false) die;
            if (result.path === false) die;
            if (result.port === false) die;
            if (result.protocol === false) die;
        }
    }
}

function benchmarkFormat() {
    var _urls = urls;
    var _n = n;
    var url = runBenchmark.url;
    for (var i = 0; i < _n; ++i) {
        for (var j = 0, k = _urls.length; j < k; ++j) {
            url.format(_urls[j]);
        }
    }
}

function benchmarkResolve(path) {
    var _urls = urls;
    var _n = n;
    var url = runBenchmark.url;
    for (var i = 0; i < _n; ++i) {
        for (var j = 0, k = _urls.length; j < k; ++j) {
            url.format(_urls[j], path);
        }
    }
}

function benchmark(name, fun) {
    var results = [];

    function pushResult(key) {
        results.push(this[key]);
    }
    fun();
    fun();

    var timestamp = process.hrtime();
    fun();
    timestamp = process.hrtime(timestamp);

    var seconds = timestamp[0];
    var nanos = timestamp[1];
    var time = seconds + nanos / 1e9;
    var rate = n / time;

    console.log('misc/url.js %s: %s', name, rate.toPrecision(8));
}
