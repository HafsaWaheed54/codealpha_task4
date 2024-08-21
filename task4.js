document.addEventListener('DOMContentLoaded', () => {
    const organizeBtn = document.getElementById('organize-btn');
    const statusDiv = document.getElementById('status');

    organizeBtn.addEventListener('click', () => {
        const sourceFilesInput = document.getElementById('source-folder');
        const targetFolderInput = document.getElementById('target-folder');

        if (sourceFilesInput.files.length === 0 || !targetFolderInput.value) {
            statusDiv.textContent = 'Please select both source files and target folder.';
            return;
        }

        const formData = new FormData();
        for (const file of sourceFilesInput.files) {
            formData.append('source_files[]', file);
        }
        formData.append('target_folder', targetFolderInput.value);

        fetch('http://127.0.0.1:5000/organize-files', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            statusDiv.textContent = data.message || 'File organization complete.';
        })
        .catch(error => {
            statusDiv.textContent = `Error: ${error.message}`;
        });
    });
});
