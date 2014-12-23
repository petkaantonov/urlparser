var test = require('tape');

var Url = require("../src/urlparser.js");

var a;

test("various path, hash and querystring combinations", function t(assert) {
    a = Url.parse("http://www.google.com");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, null);

    a = Url.parse("http://www.google.com/");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, null);

    a = Url.parse("http://www.google.com/?");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?");

    a = Url.parse("http://www.google.com?");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?");


    a = Url.parse("http://www.google.com?#");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?");
    assert.strictEqual(a.hash, "#");

    a = Url.parse("http://www.google.com/?a#");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?a");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?a");
    assert.strictEqual(a.hash, "#");


    a = Url.parse("http://www.google.com/?querystring");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?querystring");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?querystring");
    assert.strictEqual(a.hash, null);

    a = Url.parse("http://www.google.com?querystring");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?querystring");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?querystring");
    assert.strictEqual(a.hash, null);

    a = Url.parse("http://www.google.com/?query#string");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?query");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?query");
    assert.strictEqual(a.hash, "#string");


    a = Url.parse("http://www.google.com#string");
    assert.strictEqual(a.host, "www.google.com");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, null);
    assert.strictEqual(a.hash, "#string");

    assert.end();
});

test("auth stuff", function t(assert) {
    a = Url.parse("http://a@b/c@d");
    assert.strictEqual(a.host, "b");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/c@d");
    assert.strictEqual(a.pathname, "/c@d");
    assert.strictEqual(a.auth, "a");

    a = Url.parse("http://a@b@c/");
    assert.strictEqual(a.host, "c");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.auth, "a@b");

    a = Url.parse("http://a@b?@c");
    assert.strictEqual(a.host, "b");
    assert.strictEqual(a.protocol, "http:");
    assert.strictEqual(a.path, "/?@c");
    assert.strictEqual(a.pathname, "/");
    assert.strictEqual(a.search, "?@c");
    assert.strictEqual(a.auth, "a");

    assert.end();
});

test("autoescape some chars in the result", function t(assert) {
    a = Url.parse("http://www.google.com# k");
    assert.strictEqual(a.hash, "#%20k");

    a = Url.parse("http://www.google.com? k");
    assert.strictEqual(a.search, "?%20k");

    a = Url.parse("http://www.google.com/ k");
    assert.strictEqual(a.pathname, "/%20k");

    a = Url.parse("http://www.google.com#{}");
    assert.strictEqual(a.hash, "#%7B%7D");

    a = Url.parse("http://www.google.com?{}");
    assert.strictEqual(a.search, "?%7B%7D");

    a = Url.parse("http://www.google.com/{}");
    assert.strictEqual(a.pathname, "/%7B%7D");

    a = Url.parse("http://www.google.com/{}?{}#{}");
    assert.strictEqual(a.hash, "#%7B%7D");
    assert.strictEqual(a.search, "?%7B%7D");
    assert.strictEqual(a.pathname, "/%7B%7D");
    assert.strictEqual(a.href, "http://www.google.com/%7B%7D?%7B%7D#%7B%7D");

    a = Url.parse("http://www.google.com#a{b}{}");
    assert.strictEqual(a.hash, "#a%7Bb%7D%7B%7D");

    a = Url.parse("http://www.google.com?a{b}{}");
    assert.strictEqual(a.search, "?a%7Bb%7D%7B%7D");

    a = Url.parse("http://www.google.com/a{b}{}");
    assert.strictEqual(a.pathname, "/a%7Bb%7D%7B%7D");

    a = Url.parse("http://www.google.com/a{b}{}?a{b}{}#a{b}{}");
    assert.strictEqual(a.hash, "#a%7Bb%7D%7B%7D");
    assert.strictEqual(a.pathname, "/a%7Bb%7D%7B%7D");
    assert.strictEqual(a.search, "?a%7Bb%7D%7B%7D");
    assert.strictEqual(a.href, "http://www.google.com/a%7Bb%7D%7B%7D?a%7Bb%7D%7B%7D#a%7Bb%7D%7B%7D");

    a = Url.parse("http://www.google.com/gâteaux_d'ange.jpg");
    assert.strictEqual(a.pathname, "/gâteaux_d%27ange.jpg");

    assert.end();
});

test("weird protocols", function t(assert) {
    a = Url.parse("javascript:alert('hello world');");
    assert.strictEqual(a.host, null);
    assert.strictEqual(a.pathname, "alert('hello world');");
    assert.strictEqual(a.href, "javascript:alert('hello world');");

    a = Url.parse("mailto:user@example.com?subject=Message Title&body=Message Content");
    assert.strictEqual(a.href, 'mailto:user@example.com?subject=Message%20Title&body=Message%20Content');

    a = Url.parse("file:///C:/Users/Petka%20Antonov/urlparser/.npmignore");
    assert.strictEqual(a.hostname, "");
    assert.strictEqual(a.pathname, "/C:/Users/Petka%20Antonov/urlparser/.npmignore");
    assert.strictEqual(a.href, "file:///C:/Users/Petka%20Antonov/urlparser/.npmignore");

    assert.end();
});

test("ports", function t(assert) {
    a = Url.parse("http://www.google.com:80");
    assert.strictEqual(a.port, "80");

    a = Url.parse("http://www.google.com:8080");
    assert.strictEqual(a.port, "8080");

    a = Url.parse("http://www.google.com:");
    assert.strictEqual(a.port, null);

    a = Url.parse("http://www.google.com:008");
    assert.strictEqual(a.port, "8");

    assert.end();
});

test("syntax errors on hosts", function t(assert) {
    a = Url.parse("http://...");
    assert.strictEqual(a.href, "http://.../");

    var tooLongLabel = new Array(89).join("a");
    var shortLabel = new Array(5).join("a");
    var tooManyShortLabels = new Array(80);

    for( var i = 0, len = tooManyShortLabels.length; i < len; ++i ) {
        tooManyShortLabels[i] = shortLabel;
    }

    tooManyShortLabels = tooManyShortLabels.join(".");

    a = Url.parse("http://" + tooLongLabel + ".");
    assert.strictEqual(a.href, 'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaaaaaaaaaaaaaaaaaaa.');

    a = Url.parse("http://" + tooLongLabel + ".asd");
    assert.strictEqual(a.href, 'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaaaaaaaaaaaaaaaaaaa.asd');

    a = Url.parse("http://" + tooManyShortLabels + "/asd?abc");
    assert.strictEqual(a.href, "http:///asd?abc");

    assert.end();
});

test("no protocol", function t(assert) {
    a = Url.parse('/path?q=blah&other=meh#blargh:008');
    assert.strictEqual(a.pathname, "/path");
    assert.strictEqual(a.search, "?q=blah&other=meh");
    assert.strictEqual(a.hash, "#blargh:008");
    assert.strictEqual(a.href, '/path?q=blah&other=meh#blargh:008');

    a = Url.parse('//path?q=blah&other=meh#blargh:008');
    assert.strictEqual(a.pathname, "//path");
    assert.strictEqual(a.search, "?q=blah&other=meh");
    assert.strictEqual(a.hash, "#blargh:008");
    assert.strictEqual(a.href, '//path?q=blah&other=meh#blargh:008');

    assert.end();
});

test("setting null", function t(assert) {
    var protocolURI = Url.parse('https://github.com');
    protocolURI.protocol = null;
    assert.strictEqual(Url.format(protocolURI), "//github.com/");

    var portURI = Url.parse('https://github.com:8080');
    portURI.port = null;
    //node behavior
    assert.strictEqual(Url.format(portURI), "https://github.com:8080/");

    assert.end();
});

test("replace node\'s url", function t(assert) {
    Url.replace();
    assert.strictEqual(Url, require('url'));

    assert.end();
});
