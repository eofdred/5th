
const fs = require('fs');
const path = require('path');

const picturesDir = path.join(__dirname, '../public/pictures');
const outputDir = path.join(__dirname, '../src/lib/images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(picturesDir);

console.log('Converting images to Data Chunks...');

files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const filePath = path.join(picturesDir, file);
        const data = fs.readFileSync(filePath);
        const ext = path.extname(file).substring(1);
        const base64 = `data:image/${ext};base64,${data.toString('base64')}`;

        const variableName = file.replace(/[\.-]/g, '_');
        const outputFileName = path.join(outputDir, `${file}.ts`);

        // Write as a default export string
        // We use a TS file so it can be imported easily
        const content = `const data = "${base64}";\nexport default data;`;

        fs.writeFileSync(outputFileName, content);
        console.log(`Generated ${outputFileName}`);
    }
});
