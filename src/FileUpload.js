import React, { Component, PropTypes } from 'react';
import FileReceiver from './helper/FileUploadReceiver';
import FileUploadHandler from './helper/FileUploadHandler';
import FileUploadManager from './helper/FileUploadManager';
import { Flex, Box } from 'reflexbox';
import { PaddingDivWrapper } from './helper/BaseComponents';
import _ from 'lodash';

class FileUpload extends Component {
    state = {
        files: []
    };

    onFileDrop = (acceptedFiles) => {
        let { files } = this.state;
        files = files.concat(acceptedFiles);

        this.setState({ files });
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

    getItems = () => {
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
                    <PaddingDivWrapper>
                        <FileReceiver
                            customClass="upload-panel"
                            onFileDrop={this.onFileDrop}
                            isOpen
                        />
                    </PaddingDivWrapper>
                </Box>
                <Box col={12} sm={12} md={6} lg={6}>
                    <PaddingDivWrapper>
                        <FileUploadManager
                            files={files}
                            uploadUrl="/upload"
                            customClass="upload-list"
                            onUploadStart={this.onFileUpdate}
                            onUploadProgress={_.debounce(this.onFileProgress, 150)}
                            onUploadEnd={this.onFileUpdate}
                        >
                            {this.getItems()}
                        </FileUploadManager>
                    </PaddingDivWrapper>
                </Box>
            </Flex>
        );
    }
}

export default FileUpload;