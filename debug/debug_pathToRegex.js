const { match } = require('path-to-regexp');

// what i found during research
const m = match('/:uid');
console.log(m('/6.png'));
console.log(m('/no'));

// original idea
/*
    const dict: { [x: string]: any } = {};

    const regex = pathToRegexp(this._endpointPath);
    const matches = this._url.match(regex);
    if (matches === null) return {};

    console.log(`regex: ${regex}`);
    console.log('matches:', '\n', matches);

    return dict;
*/
