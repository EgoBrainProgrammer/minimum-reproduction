import { Op } from 'sequelize';

function tryParseDate(value) {
    if(typeof value === "string" && !isNaN(Date.parse(value)))
        value = new Date(value)
    
    return value;
}

function tryParseDates(value) {
    if(Array.isArray(value))
        value = value.map(x => tryParseDate(x));
    
    return tryParseDate(value);
}

function parseFilter(filter, keys: string[] = null) {
    const newfilter = JSON.parse(JSON.stringify(filter));
    for (const [key, value] of Object.entries(newfilter)) {
        if(Array.isArray(keys) && !keys.includes(key)) {
            delete newfilter[key];
            continue;
        }

        if(value && typeof value === "object") {
            let parsed = {};
            Object.keys(value).forEach(k => {
                parsed = { 
                    ...parsed,
                    [Op[k]]: tryParseDates(value[k])
                };
            });
            newfilter[key] = parsed;
        } else
            newfilter[key] = tryParseDates(value);
    }

    return newfilter;
}

function arrayStringToArrayNumber(arr) {
    return arr.replace(' ', '').replace('[', '').replace(']', '').split(',').map(val => Number(val));
}

function quickSortBy(array, field) {
    if (array.length <= 1) {
        return array;
    }

    let pivotIndex = Math.floor(array.length / 2);
    let pivot = array[pivotIndex];
    let less = [];
    let greater = [];

    for (let i = 0; i < array.length; ++i) {
        if(i === pivotIndex)
            continue;
        if (array[i][field] < pivot[field])
            less.push(array[i]);
        else
            greater.push(array[i]);
    }

    return [...quickSortBy(less, field), pivot, ...quickSortBy(greater, field)];
}

function dateToString(date) {
    if(date == null)
        return date;
    if(["string", "number"].includes(typeof date))
        date = new Date(date);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

function computeRequestUrl(request) {
    let url = `${request.protocol}://${request.get('host')}`;
        const headerIndex = request.rawHeaders.findIndex(x => x == "Origin");
        if (headerIndex > -1)
            url = request.rawHeaders[headerIndex + 1];

    return url;
}

export { parseFilter, arrayStringToArrayNumber, quickSortBy, dateToString, computeRequestUrl };