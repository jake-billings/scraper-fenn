const request = require('request');
const cheerio = require('cheerio');
const jsonToCSV = require('json-to-csv');


request({
    method: 'POST',
    url: 'http://tarryscant.com/search.php',
    form: {search: 'e'}
}, (err, response, body) => {
    if (err) return console.error(err);

    const $ = cheerio.load(body)

    let tables = [];

    $('table').each((i, tableElem) => {
        let table = {};
        let keys = [];
        let values = [];

        $(tableElem).find('th').each((i, thElem) => {
            keys.push($(thElem).text())
        });
        $(tableElem).find('td').each((i, thElem) => {
            let text = $(thElem).text();
            if (text === 'Click Here') text = $(thElem).children().attr('href');
            values.push(text);
        });

        for (let i = 0; i < keys.length && i < values.length; i++) {
            const keyIndex = i;
            let valIndex = i;
            if (valIndex >= 3) valIndex++;

            table[keys[keyIndex]] = values[valIndex];
        }

        tables.push(table)
    });

    jsonToCSV(tables, 'fenn.csv')
        .then(() => {
            console.log('done');
        })
        .catch(error => {
            console.log('we fucked up', error);
        })
});