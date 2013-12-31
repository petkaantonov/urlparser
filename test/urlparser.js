var assert = require("assert");
var Url = require("../js/urlparser.js");


describe("basic tests", function() {
    var a;
    specify("various path, hash and querystring combinations", function(){
        a = Url.parse("http://www.google.com");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === null);

        a = Url.parse("http://www.google.com/");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === null);

        a = Url.parse("http://www.google.com/?");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?");
        assert(a.pathname === "/");
        assert(a.search === "?");

        a = Url.parse("http://www.google.com?");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?");
        assert(a.pathname === "/");
        assert(a.search === "?");


        a = Url.parse("http://www.google.com?#");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?");
        assert(a.pathname === "/");
        assert(a.search === "?");
        assert(a.hash === "#");

        a = Url.parse("http://www.google.com/?a#");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?a");
        assert(a.pathname === "/");
        assert(a.search === "?a");
        assert(a.hash === "#");


        a = Url.parse("http://www.google.com/?querystring");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?querystring");
        assert(a.pathname === "/");
        assert(a.search === "?querystring");
        assert(a.hash === null);

        a = Url.parse("http://www.google.com?querystring");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?querystring");
        assert(a.pathname === "/");
        assert(a.search === "?querystring");
        assert(a.hash === null);

        a = Url.parse("http://www.google.com/?query#string");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?query");
        assert(a.pathname === "/");
        assert(a.search === "?query");
        assert(a.hash === "#string");


        a = Url.parse("http://www.google.com#string");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === null);
        assert(a.hash === "#string");
    });

    specify("auth stuff", function() {
        a = Url.parse("http://a@b/c@d");
        assert(a.host === "b");
        assert(a.protocol === "http:");
        assert(a.path === "/c@d");
        assert(a.pathname === "/c@d");
        assert(a.auth === "a");

        a = Url.parse("http://a@b@c/");
        assert(a.host === "c");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.auth === "a@b");

        a = Url.parse("http://a@b?@c");
        assert(a.host === "b");
        assert(a.protocol === "http:");
        assert(a.path === "/?@c");
        assert(a.pathname === "/");
        assert(a.search === "?@c");
        assert(a.auth === "a");
    });

    specify("autoescape some chars in the result", function() {
        a = Url.parse("http://www.google.com# k");
        assert.equal(a.hash, "#%20k");

        a = Url.parse("http://www.google.com? k");
        assert(a.search === "?%20k");

        a = Url.parse("http://www.google.com/ k");
        assert(a.pathname === "/%20k");

        a = Url.parse("http://www.google.com#{}");
        assert(a.hash === "#%7B%7D");

        a = Url.parse("http://www.google.com?{}");
        assert(a.search === "?%7B%7D");

        a = Url.parse("http://www.google.com/{}");
        assert(a.pathname === "/%7B%7D");

        a = Url.parse("http://www.google.com/{}?{}#{}");
        assert(a.hash === "#%7B%7D");
        assert(a.search === "?%7B%7D");
        assert(a.pathname === "/%7B%7D");
        assert(a.href === "http://www.google.com/%7B%7D?%7B%7D#%7B%7D");

        a = Url.parse("http://www.google.com#a{b}{}");
        assert(a.hash === "#a%7Bb%7D%7B%7D");

        a = Url.parse("http://www.google.com?a{b}{}");
        assert(a.search === "?a%7Bb%7D%7B%7D");

        a = Url.parse("http://www.google.com/a{b}{}");
        assert(a.pathname === "/a%7Bb%7D%7B%7D");

        a = Url.parse("http://www.google.com/a{b}{}?a{b}{}#a{b}{}");
        assert(a.hash === "#a%7Bb%7D%7B%7D");
        assert(a.pathname === "/a%7Bb%7D%7B%7D");
        assert(a.search === "?a%7Bb%7D%7B%7D");
        assert(a.href === "http://www.google.com/a%7Bb%7D%7B%7D?a%7Bb%7D%7B%7D#a%7Bb%7D%7B%7D");
    });

    specify("weird protocols", function() {
        a = Url.parse("javascript:alert('hello world');");
        assert.equal(a.host, null);
        assert.equal(a.pathname, "alert('hello world');");
        assert.equal(a.href, "javascript:alert('hello world');");

        a = Url.parse("mailto:user@example.com?subject=Message Title&body=Message Content");
        assert.equal(a.href, 'mailto:user@example.com?subject=Message%20Title&body=Message%20Content');

        a = Url.parse("file:///C:/Users/Petka%20Antonov/urlparser/.npmignore");
        assert.equal(a.hostname, "");
        assert.equal(a.pathname, "/C:/Users/Petka%20Antonov/urlparser/.npmignore");
        assert.equal(a.href, "file:///C:/Users/Petka%20Antonov/urlparser/.npmignore");
    });

    specify("ports", function() {
        a = Url.parse("http://www.google.com:80");
        assert.equal(a.port, "80");

        a = Url.parse("http://www.google.com:8080");
        assert.equal(a.port, "8080");

        a = Url.parse("http://www.google.com:");
        assert.equal(a.port, null);

        a = Url.parse("http://www.google.com:008");
        assert.equal(a.port, "8");
    });

    specify("syntax errors on hosts", function() {
        a = Url.parse("http://...");
        assert.equal(a.href, "http://.../");

        var tooLongLabel = new Array(89).join("a");
        var shortLabel = new Array(5).join("a");
        var tooManyShortLabels = new Array(80);

        for( var i = 0, len = tooManyShortLabels.length; i < len; ++i ) {
            tooManyShortLabels[i] = shortLabel;
        }

        tooManyShortLabels = tooManyShortLabels.join(".");

        a = Url.parse("http://" + tooLongLabel + ".");
        assert.equal(a.href, 'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaaaaaaaaaaaaaaaaaaa.');

        a = Url.parse("http://" + tooLongLabel + ".asd");
        assert.equal(a.href, 'http://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/aaaaaaaaaaaaaaaaaaaaaaaaa.asd');

        a = Url.parse("http://" + tooManyShortLabels + "/asd?abc");
        assert.equal(a.href, "http:///asd?abc");

    });

    specify("no protocol", function() {
        a = Url.parse('/path?q=blah&other=meh#blargh:008');
        assert.equal(a.pathname, "/path");
        assert.equal(a.search, "?q=blah&other=meh");
        assert.equal(a.hash, "#blargh:008");
        assert.equal(a.href, '/path?q=blah&other=meh#blargh:008')

        a = Url.parse('//path?q=blah&other=meh#blargh:008');
        assert.equal(a.pathname, "//path");
        assert.equal(a.search, "?q=blah&other=meh");
        assert.equal(a.hash, "#blargh:008");
        assert.equal(a.href, '//path?q=blah&other=meh#blargh:008')
    });

    specify("ip6", function() {

    });

    //Syntax errors
});

