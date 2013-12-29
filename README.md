    Petka Antonov@PETKAANTONOV-PC ~/urlparser (master)
    $ node ./benchmark/urlparser.js
    misc/url.js parse(): 402045.67
    misc/url.js format(): 253946.82
    misc/url.js resolve("../foo/bar?baz=boom"): 56701.419
    misc/url.js resolve("foo/bar"): 80059.500
    misc/url.js resolve("http://nodejs.org"): 118566.13
    misc/url.js resolve("./foo/bar?baz"): 62778.648

    Petka Antonov@PETKAANTONOV-PC ~/urlparser (master)
    $ node ./benchmark/nodecore.js
    misc/url.js parse(): 16459
    misc/url.js format(): 15978
    misc/url.js resolve("../foo/bar?baz=boom"): 6837.7
    misc/url.js resolve("foo/bar"): 7038.6
    misc/url.js resolve("http://nodejs.org"): 6491.1
    misc/url.js resolve("./foo/bar?baz"): 6968.4
