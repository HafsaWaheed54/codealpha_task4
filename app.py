from flask import Flask, request, jsonify
import os
import shutil

app = Flask(__name__)

@app.route('/organize-files', methods=['POST'])
def organize_files():
    if 'source_files[]' not in request.files:
        return jsonify({'message': 'No files uploaded'}), 400

    source_files = request.files.getlist('source_files[]')
    target_folder = request.form.get('target_folder')

    if not target_folder:
        return jsonify({'message': 'No target folder selected'}), 400

    target_folder_path = os.path.join('uploads', target_folder)
    os.makedirs(target_folder_path, exist_ok=True)

    for file in source_files:
        file_path = os.path.join(target_folder_path, file.filename)
        file.save(file_path)

        file_extension = file.filename.rsplit('.', 1)[-1].lower()
        extension_folder = os.path.join(target_folder_path, file_extension)
        os.makedirs(extension_folder, exist_ok=True)

        shutil.move(file_path, os.path.join(extension_folder, file.filename))

    return jsonify({'message': 'Files organized successfully'})

if __name__ == '__main__':
    app.run(debug=True)
