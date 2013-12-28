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
        assert(a.search === "");

        a = Url.parse("http://www.google.com/");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "");

        a = Url.parse("http://www.google.com/?");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "");

        a = Url.parse("http://www.google.com?");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "");

        a = Url.parse("http://www.google.com?#");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "");
        assert(a.hash === "");

        a = Url.parse("http://www.google.com/?#");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "");
        assert(a.hash === "");

        a = Url.parse("http://www.google.com/?a#");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?a");
        assert(a.pathname === "/");
        assert(a.search === "?a");
        assert(a.hash === "");


        a = Url.parse("http://www.google.com/?querystring");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?querystring");
        assert(a.pathname === "/");
        assert(a.search === "?querystring");
        assert(a.hash === "");

        a = Url.parse("http://www.google.com?querystring");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/?querystring");
        assert(a.pathname === "/");
        assert(a.search === "?querystring");
        assert(a.hash === "");

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
        assert(a.search === "");
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

    //Escape for hash, qs, path: also boundaries
});

