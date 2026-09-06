"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToCSV = convertToCSV;
exports.parseCSV = parseCSV;
exports.convertToJSON = convertToJSON;
exports.createCSVBuffer = createCSVBuffer;
exports.createJSONBuffer = createJSONBuffer;
function convertToCSV(data) {
    if (!data || data.length === 0) {
        return '';
    }
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.map(escapeCSVValue).join(',');
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            return escapeCSVValue(value);
        }).join(',');
    });
    return [csvHeaders, ...csvRows].join('\n');
}
function escapeCSVValue(value) {
    if (value === null || value === undefined)
        return '';
    const text = String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
function parseCSV(csv) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;
    for (let i = 0; i < csv.length; i += 1) {
        const char = csv[i];
        if (char === '"') {
            if (quoted && csv[i + 1] === '"') {
                value += '"';
                i += 1;
            }
            else {
                quoted = !quoted;
            }
        }
        else if (char === ',' && !quoted) {
            row.push(value);
            value = '';
        }
        else if ((char === '\n' || char === '\r') && !quoted) {
            if (char === '\r' && csv[i + 1] === '\n')
                i += 1;
            row.push(value);
            if (row.some((cell) => cell.trim()))
                rows.push(row);
            row = [];
            value = '';
        }
        else {
            value += char;
        }
    }
    if (value || row.length) {
        row.push(value);
        if (row.some((cell) => cell.trim()))
            rows.push(row);
    }
    const headers = rows.shift() || [];
    return rows.map((cells) => headers.reduce((result, header, index) => {
        result[header.trim()] = (cells[index] || '').trim();
        return result;
    }, {}));
}
function convertToJSON(data) {
    return JSON.stringify(data, null, 2);
}
function createCSVBuffer(data) {
    const csv = convertToCSV(data);
    return Buffer.from(csv, 'utf-8');
}
function createJSONBuffer(data) {
    const json = convertToJSON(data);
    return Buffer.from(json, 'utf-8');
}
//# sourceMappingURL=index.js.map