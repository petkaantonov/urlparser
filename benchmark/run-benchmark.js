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
    benchmark('parse()', url.parse.bind(url), [
        'auth',
        'slashes',
        'host',
        'hostname',
        'hash',
        'search',
        'pathname'
    ]);

    benchmark('format()', url.format.bind(url));

    paths.forEach(function(p) {
        benchmark('resolve("' + p + '")', function(u) {
            url.resolve(u, p);
        });
    });
}

function benchmark(name, fun, readKeys) {
    var results = [];

    function pushResult(key) {
        results.push(this[key]);
    }

    function run() {
        for (var i = 0; i < n; ++i) {
            for (var j = 0, k = urls.length; j < k; ++j) {
                var result = fun(urls[j]);

                if (Array.isArray(readKeys)) {
                    readKeys.forEach(pushResult);
                } else {
                    results.push(result);
                }
            }
        }
    }

    var timestamp = process.hrtime();
    run();
    timestamp = process.hrtime(timestamp);

    var seconds = timestamp[0];
    var nanos = timestamp[1];
    var time = seconds + nanos / 1e9;
    var rate = n / time;

    console.log('misc/url.js %s: %s', name, rate.toPrecision(8));
}
