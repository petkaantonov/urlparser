"use strict";
function Url() {
    this._protocol = "";
    this._href = "";
    this._port = -1;
    this._prependSlash = false;

    this.auth = "";
    this.slashes = false;
    this.host = "";
    this.hostname = "";
    this.hash = "";
    this.search = "";
    this.pathname = "/";
}

Url.prototype.parse = function Url$parse(str) {
    if (typeof str !== "string") throw new TypeError("");
    var start = 0;
    var end = str.length - 1;

    while (str.charCodeAt(start) <= SPACE) start++;
    while (str.charCodeAt(end) <= SPACE) end--;

    start = this._parseProtocol(str, start, end);


    if (this._protocol !== "javascript") {
        start = this._parseHost(str, start, end);
    }

    if (start <= end) {
        var ch = str.charCodeAt(start);

        if (ch === SLASH) {
            this._parsePath(str, start, end);
        }
        else if (ch === QUESTION_MARK || ch === HASH) {
            if (this.hostname === "" || !this._slashProtocols[this._protocol]) {
                this.pathname = "";
            }
            if (ch === HASH) {
                this._parseHash(str, start, end);
            }
            else {
                this._parseQuery(str, start, end);
            }
        }
        else if (this._protocol !== "javascript") {
            this._parsePath(str, start, end);
        }
        else {
            this.pathname = str.slice(start, end + 1 );
        }
    }
};

//TODO replace with querystringparser
var querystring = require("querystring");
Url.prototype.format = function Url$format() {
    var auth = this.auth || "";

    if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
    }

    var protocol = this.protocol || "";
    var pathname = this.pathname || "";
    var hash = this.hash || "";
    var search = this.search || "";
    var query = "";
    var hostname = this.hostname || "";
    var port = this.port || "";
    var host = false;
    var scheme = "";

    if (this.query && typeof this.query === "object") {
        query = querystring.stringify(this.query);
    }

    if (!search) {
        search = query ? "?" + query : "";
    }

    if (protocol && protocol.charCodeAt(protocol.length - 1) !== COLON)
        protocol += ":";

    if (this.host) {
        host = auth + this.host;
    }
    else if (hostname) {
        var ip6 = hostname.indexOf(":") > -1;
        if (ip6) hostname = "[" + hostname + "]";
        host = auth + hostname + (port ? ":" + port : "");
    }

    var slashes = this.slashes ||
        ((!protocol ||
        slashProtocols[protocol]) && host !== false);


    if (protocol) scheme = protocol + (slashes ? "//" : "");
    else if (slashes && auth) scheme = "//";

    if (slashes && pathname && pathname.charCodeAt(0) !== SLASH) {
        pathname = "/" + pathname;
    }
    else if (!slashes && pathname === "/") {
        pathname = "";
    }
    if (search && search.charCodeAt(0) !== QUESTION_MARK)
        search = "?" + search;
    if (hash && hash.charCodeAt(0) !== HASH)
        hash = "#" + hash;

    pathname = escapePathName(pathname);
    search = escapeSearch(search);

    return scheme + (host === false ? "" : host) + pathname + search + hash;
};

Url.prototype._queryToSearch = function Url$_queryToSearch() {
    var query = this.query;

    if (query === null || query === "") return "";

    if (typeof query === "string") {
        return "?" + query;
    }
    //TODO Serialize querystring
};

var punycode = require("punycode");
Url.prototype._hostIdna = function Url$_hostIdna(hostname) {
    // IDNA Support: Returns a puny coded representation of "domain".
    // It only converts the part of the domain name that
    // has non ASCII characters. I.e. it dosent matter if
    // you call it with a domain that already is in ASCII.
    var domainArray = hostname.split(".");
    var newOut = [];
    for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            "xn--" + punycode.encode(s) : s);
    }
    return newOut.join(".");
};

var escapePathName = Url.prototype._escapePathName =
function Url$_escapePathName(pathname) {
    if (!containsCharacter2(pathname, HASH, QUESTION_MARK)) return pathname;
    //Avoid closure creation to keep this inlinable
    return _escapePath(pathname);
};

var escapeSearch = Url.prototype._escapeSearch =
function Url$_escapeSearch(search) {
    if (!containsCharacter2(search, HASH, -1)) return search;
    //Avoid closure creation to keep this inlinable
    return _escapeSearch(search);
};

Url.prototype._parseProtocol = function Url$_parseProtocol(str, start, end) {
    var doLowerCase = false;
    var protocolCharacters = this._protocolCharacters;

    for (var i = start; i <= end; ++i) {
        var ch = str.charCodeAt(i);

        if (ch === COLON) {
            var protocol = str.slice(start, i);
            if (doLowerCase) protocol = protocol.toLowerCase();
            this._protocol = protocol;
            return i + 1;
        }
        else if (protocolCharacters[ch] === 1) {
            if (ch < FIRST_LOWER_CASE)
                doLowerCase = true;
        }
        else {
            return start;
        }

    }
    return start;
};

Url.prototype._parseAuth = function Url$_parseAuth(str, start, end, decode) {
    var auth = str.slice(start, end + 1);
    if (decode) {
        auth = decodeURIComponent(auth);
    }
    this.auth = auth;
};

Url.prototype._parsePort = function Url$_parsePort(str, start, end) {
    //Internal format is integer for more efficient parsing
    //and for efficient trimming of leading zeros
    var port = 0;
    //Distinguish between :0 and : (no port number at all)
    var hadChars = false;

    for (var i = start; i <= end; ++i) {
        var ch = str.charCodeAt(i);

        if (FIRST_DECIMAL <= ch && ch <= LAST_DECIMAL) {
            port = (10 * port) + (ch - FIRST_DECIMAL);
            hadChars = true;
        }
        else break;

    }
    if (port === 0 && !hadChars) {
        return 0;
    }

    this._port = port;
    return i - start;
};

Url.prototype._parseHost = function Url$_parseHost(str, start, end) {
    if (str.charCodeAt(start) === SLASH &&
        str.charCodeAt(start + 1) === SLASH) {
        this.slashes = true;
        if (start === 0) {
            var containsAt = str.indexOf("@");
            if (containsAt === -1)
                return start;
        }
        start += 2;
    }
    else if (this._protocol === "") {
        return start;
    }

    var doLowerCase = false;
    var idna = false;
    var hostNameStart = start;
    var hostNameEnd = end;
    var lastCh = -1;
    var portLength = 0;
    var charsAfterDot = 0;
    var hostEndingCharacters = this._hostEndingCharacters;
    var decode = false;

    var j = -1;
    for (var i = start; i <= end; ++i) {
        var ch = str.charCodeAt(i);

        if (ch === AT_SIGN) {
            j = i;
        }
        else if (ch === PERCENT) {
            decode = true;
        }
        else if (hostEndingCharacters[ch] === 1) {
            break;
        }
    }

    if (j > -1) {
        this._parseAuth(str, start, j - 1, decode);
        start = hostNameStart = j + 1;
    }

    if (str.charCodeAt(start) === LEFT_BRACKET) {
        for (var i = start + 1; i <= end; ++i) {
            var ch = str.charCodeAt(i);

            if (ch === RIGHT_BRACKET) {
                if (str.charCodeAt(i + 1) === COLON) {
                    portLength = this._parsePort(str, i + 2, end) + 1;
                }
                var hostname = str.slice(start + 1, i).toLowerCase();
                this.hostname = hostname;
                this.host = this._port > 0
                    ? "[" + hostname + "]:" + this._port
                    : "[" + hostname + "]";
                return i + portLength + 1;
            }
        }
        return start;
    }

    for (var i = start; i <= end; ++i) {
        if (charsAfterDot > 62) {
            this.hostname = this.host = str.slice(start, i);
            return i;
        }
        var ch = str.charCodeAt(i);

        if (ch === COLON) {
            portLength = this._parsePort(str, i + 1, end) + 1;
            hostNameEnd = i - 1;
            break;
        }
        else if (ch < FIRST_LOWER_CASE) {
            if (ch === DOT) {
                //Node.js ignores this error
                /*
                if (lastCh === DOT || lastCh === -1) {
                    this.hostname = this.host = "";
                    return start;
                }
                */
                charsAfterDot = -1;
            }
            else if (FIRST_UPPER_CASE <= ch && ch <= LAST_UPPER_CASE) {
                doLowerCase = true;
            }
            else if (!(ch === HYPHEN || ch === LO_DASH ||
                (FIRST_DECIMAL <= ch && ch <= LAST_DECIMAL))) {
                if (hostEndingCharacters[ch] === 0) {
                    this._prependSlash = true;
                }
                hostNameEnd = i - 1;
                break;
            }
        }
        else if (ch >= 0x7B) {
            if (ch <= 0x7E) {
                this._prependSlash = true;
                hostNameEnd = i - 1;
                break;
            }
            idna = true;
        }
        lastCh = ch;
        charsAfterDot++;
    }

    //Node.js ignores this error
    /*
    if (lastCh === DOT) {
        hostNameEnd--;
    }
    */

    if (hostNameEnd + 1 !== start &&
        hostNameEnd - hostNameStart <= 256) {
        var hostname = str.slice(hostNameStart, hostNameEnd + 1);
        if (doLowerCase) hostname = hostname.toLowerCase();
        if (idna) hostname = this._hostIdna(hostname);
        this.hostname = hostname;
        this.host = this._port > 0 ? hostname + ":" + this._port : hostname;
    }

    return hostNameEnd + 1 + portLength;

};

Url.prototype._getComponentEscaped =
function Url$_getComponentEscaped(str, start, end) {
    var cur = start;
    var i = start;
    var ret = "";
    var autoEscapeMap = this._autoEscapeMap;
    for (; i <= end; ++i) {
        var ch = str.charCodeAt(i);
        var escaped = autoEscapeMap[ch];

        if (escaped !== "") {
            if (cur < i) ret += str.slice(cur, i);
            ret += escaped;
            cur = i + 1;
        }
    }
    if (cur < i + 1) ret += str.slice(cur, i);
    return ret;
};

Url.prototype._parsePath =
function Url$_parsePath(str, start, end) {
    var pathStart = start;
    var pathEnd = end;
    var escape = false;
    var autoEscapeCharacters = this._autoEscapeCharacters;

    for (var i = start; i <= end; ++i) {
        var ch = str.charCodeAt(i);
        if (ch === HASH) {
            this._parseHash(str, i, end);
            pathEnd = i - 1;
            break;
        }
        else if (ch === QUESTION_MARK) {
            this._parseQuery(str, i, end);
            pathEnd = i - 1;
            break;
        }
        else if (!escape && autoEscapeCharacters[ch] === 1) {
            escape = true;
        }
    }

    if (pathStart > pathEnd) {
        this.pathname = "/";
        return;
    }

    var path;
    if (escape) {
        path = this._getComponentEscaped(str, pathStart, pathEnd);
    }
    else {
        path = str.slice(pathStart, pathEnd + 1);
    }
    this.pathname = this._prependSlash ? "/" + path : path;
};

Url.prototype._parseQuery = function Url$_parseQuery(str, start, end) {
    var queryStart = start;
    var queryEnd = end;
    var escape = false;
    var autoEscapeCharacters = this._autoEscapeCharacters;

    for (var i = start; i <= end; ++i) {
        var ch = str.charCodeAt(i);

        if (ch === HASH) {
            this._parseHash(str, i, end);
            queryEnd = i - 1;
            break;
        }
        else if (!escape && autoEscapeCharacters[ch] === 1) {
            escape = true;
        }
    }

    if (queryStart > queryEnd) {
        this.search = this.query = "";
        return;
    }

    var query;
    if (escape) {
        query = this._getComponentEscaped(str, queryStart, queryEnd);
    }
    else {
        query = str.slice(queryStart, queryEnd + 1);
    }
    this.search = query;
};

Url.prototype._parseHash = function Url$_parseHash(str, start, end) {
    if (start > end) {
        this.hash = "";
        return;
    }
    this.hash = this._getComponentEscaped(str, start, end);
};

Object.defineProperty(Url.prototype, "port", {
    get: function() {
        if (this._port >= 0) {
            return ("" + this._port);
        }
        return "";
    },
    set: function(v) {
        this._port = parseInt(v, 10);
    }
});

Object.defineProperty(Url.prototype, "query", {
    get: function() {
        return this.search !== "" ? this.search.slice(1) : "";
    },
    set: function() {

    }
});

Object.defineProperty(Url.prototype, "path", {
    get: function() {
        return this.pathname + this.search;
    },
    set: function() {

    }
});

Object.defineProperty(Url.prototype, "protocol", {
    get: function() {
        var proto = this._protocol;
        return proto === "" ? "" : proto + ":";
    },
    set: function(v) {
        this._protocol = v.slice(0, v.length - 1);
    }
});

Object.defineProperty(Url.prototype, "href", {
    get: function() {
        var href = this._href;
        if (href === "") {
            href = this._href = this.format();
        }
        return href;
    },
    set: function() {
    }
});

Url.parse = function Url$Parse(str) {
    var ret = new Url();
    ret.parse(str);
    return ret;
};

Url.format = function Url$Format(obj) {
    if (typeof obj === "string") {
        obj = Url.parse(obj);
    }
    if (!(obj instanceof Url)) {
        return Url.prototype.format.call(obj);
    }
    return obj.format();
};

function _escapePath(pathname) {
    return pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
    });
}

function _escapeSearch(search) {
    return search.replace(/#/g, function(match) {
        return encodeURIComponent(match);
    });
}

function containsCharacter2(string, char1, char2) {
    for (var i = 0, len = string.length; i < len; ++i) {
        var ch = string.charCodeAt(i);
        if (ch === char1 || ch === char2) return true;
    }
    return false;
}

function makeAsciiTable(spec) {
    var ret = new Uint8Array(128);
    spec.forEach(function(item){
        if (typeof item === "number") {
            ret[item] = 1;
        }
        else {
            var start = item[0];
            var end = item[1];
            for (var j = start; j <= end; ++j) {
                ret[j] = 1;
            }
        }
    });

    return ret;
}

var autoEscape = ["<", ">", "\"", "`", " ", "\r", "\n",
    "\t", "{", "}", "|", "\\", "^", "`", "'"];

var autoEscapeMap = new Array(128);

for (var i = 0, len = autoEscapeMap.length; i < len; ++i) {
    autoEscapeMap[i] = "";
}

for (var i = 0, len = autoEscape.length; i < len; ++i) {
    var c = autoEscape[i];
    var esc = encodeURIComponent(c);
    if (esc === c) {
        esc = escape(c);
    }
    autoEscapeMap[c.charCodeAt(0)] = esc;
}


var slashProtocols = Url.prototype._slashProtocols = {
    http: true,
    https: true,
    gopher: true,
    file: true,
    ftp: true,

    "http:": true,
    "https:": true,
    "gopher:": true,
    "file:": true,
    "ftp:": true
};

//Optimize back from normalized object caused by non-identifier keys
function f(){}
f.prototype = slashProtocols;

Url.prototype._protocolCharacters = makeAsciiTable([
    [FIRST_LOWER_CASE, LAST_LOWER_CASE],
    [FIRST_UPPER_CASE, LAST_UPPER_CASE],
    DOT, PLUS, HYPHEN
]);

Url.prototype._hostEndingCharacters = makeAsciiTable([
    HASH, QUESTION_MARK, SLASH
]);

Url.prototype._autoEscapeCharacters = makeAsciiTable(
    autoEscape.map(function(v) {
        return v.charCodeAt(0);
    })
);

Url.prototype._autoEscapeMap = autoEscapeMap;

module.exports = Url;
