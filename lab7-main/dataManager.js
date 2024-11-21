// dataManager.js
const fs = require('fs');
const path = require('path');

const loadData = (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(path.join(__dirname, filePath));
        return JSON.parse(dataBuffer);
    } catch (e) {
        return [];
    }
};

const saveData = (filePath, data) => {
    fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify(data, null, 2));
};

module.exports = { loadData, saveData };