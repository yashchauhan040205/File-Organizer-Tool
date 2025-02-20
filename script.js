const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const classifyFileType = (ext) => {
    const imageTypes = ['.jpg', '.jpeg', '.png', '.gif'];
    const documentTypes = ['.txt', '.pdf', '.docx', '.pptx'];
    const videoTypes = ['.mp4', '.mkv', '.avi'];

    if (imageTypes.includes(ext)) return 'Images';
    if (documentTypes.includes(ext)) return 'Documents';
    if (videoTypes.includes(ext)) return 'Videos';
    return 'Others';
};

const organizeFiles = (dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        let logData = `Operations performed on ${new Date().toLocaleString()}:\n\n`;

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const ext = path.extname(file).toLowerCase();
            const folderName = classifyFileType(ext);
            const folderPath = path.join(dirPath, folderName);

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
                logData += `Created folder: ${folderName}\n`;
            }

            const newFilePath = path.join(folderPath, file);
            fs.renameSync(filePath, newFilePath);
            logData += `Moved file: ${file} to ${folderName}\n`;
        });

        fs.appendFileSync('summary.txt', logData);
        console.log('Files organized and log updated!');
        console.log('23IT016');
    });
};

rl.question('Enter the directory path: ', (dirPath) => {
    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
        organizeFiles(dirPath);
    } else {
        console.log('Invalid directory path!');
    }
    rl.close();
});
