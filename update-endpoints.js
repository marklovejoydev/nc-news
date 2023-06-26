const fs = require('fs/promises')


function updateEndpoints(filePath, updatedData) {
    fs.readFile(filePath, 'utf8')
    .then(data => {
        const parsedData = JSON.parse(data)
        const mergedData = {...parsedData, ...updatedData}
        const newData = JSON.stringify(mergedData, null, 2)
        
        return fs.writeFile(filePath, newData, 'utf8')
    })
}


module.exports = {updateEndpoints}