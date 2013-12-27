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
        assert(a.path === "/");
        assert(a.pathname === "/");
        assert(a.search === "?a");
        assert(a.hash === "");


        a = Url.parse("http://www.google.com/?querystring");
        assert(a.host === "www.google.com");
        assert(a.protocol === "http:");
        assert(a.path === "/");
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
        assert(a.path === "/");
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
});

