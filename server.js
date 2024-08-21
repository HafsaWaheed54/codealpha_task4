const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/organize-files', upload.fields([{ name: 'source_files[]', maxCount: 100 }, { name: 'target_folder', maxCount: 1 }]), (req, res) => {
    const sourceFiles = req.files['source_files[]'];
    const targetFolder = req.files['target_folder'][0].path;

    if (!sourceFiles || !targetFolder) {
        return res.json({ success: false, error: 'Missing files or target folder.' });
    }

    try {
        sourceFiles.forEach(file => {
            const filePath = path.join('uploads', file.filename);
            const fileExtension = path.extname(file.originalname).slice(1);
            const destinationFolder = path.join(targetFolder, fileExtension);

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder);
            }

            fs.renameSync(filePath, path.join(destinationFolder, file.originalname));
        });

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
