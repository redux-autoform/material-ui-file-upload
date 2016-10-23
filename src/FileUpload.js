import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FileReceiver from './helper/FileUploadReceiver';
import FileUploadHandler from './helper/FileUploadHandler';
import FileUploadManager from './helper/FileUploadManager';
import { Flex, Box } from 'reflexbox';
import _ from 'lodash';

class FileUpload extends Component {
    state = {
        files: []
    };

    onFileDrop = (files) => {
        console.info("Calling onFileDrop yay!!");

        this.setState({
            files: this.state.files.concat(files)
        });
    };

    onFileProgress = (file) => {
        let files = this.state.files;

        files.map((_file) => {
            if (_file.id === file.id) {
                _file = file;
            }
        });

        this.setState({
            files: files
        });
    };

    onFileUpdate = (file) => {
        let files = this.state.files;

        files.map((_file) => {
            if (_file.id === file.id) {
                _file = file;
            }
        });

        this.setState({
            files: files
        });
    };

    getFileUploadHandlers = () => {
        let { files } = this.state;

        if (Array.isArray(files)) {
            return files.map((file, index) => (
                <FileUploadHandler
                    key={`upload-handler-${index}`}
                    file={file}
                    autoStart
                />
            ))
        }

        return null;
    };

    render() {
        let { files } = this.state;

        return (
            <Flex wrap>
                <Box col={12} sm={12} md={6} lg={6}>
                    <div className="padding-10">
                        <FileReceiver
                            ref="uploadPanel"
                            customClass="upload-panel"
                            isOpen={true}
                            onFileDrop={this.onFileDrop}
                        />
                    </div>
                </Box>
                <Box col={12} sm={12} md={6} lg={6}>
                    <div className="padding-10">
                        <FileUploadManager
                            files={files}
                            uploadUrl="/upload"
                            customClass="upload-list"
                            onUploadStart={this.onFileUpdate}
                            onUploadProgress={_.debounce(this.onFileProgress, 150)}
                            onUploadEnd={this.onFileUpdate}
                        >
                            {this.getFileUploadHandlers()}
                        </FileUploadManager>
                    </div>
                </Box>
            </Flex>
        );
    }
}

export default FileUpload;