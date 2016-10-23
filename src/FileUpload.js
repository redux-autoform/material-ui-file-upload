import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import FileReceiver from './helper/FileReceiver';
import FileUploadHandler from './helper/FileUploadHandler';
import FileUploadManager from './helper/FileUploadManager';
import { Flex, Box } from 'reflexbox';
import _ from 'lodash';

class FileUpload extends Component {
    state = {
        isPanelOpen: true,
        isDragOver: false,
        files: []
    };

    onDragOver = (e) => {
        // your codes here:
        // if you want to check if the files are dragged over
        // a specific DOM node
        //if (e.target === node) {
        //    this.setState({
        //        isDragOver: true
        //    });
        //}
    };

    onFileDrop = ({target}, files) => {
        let node = ReactDOM.findDOMNode(this.refs.uploadPanel);

        if (target != node) {
            return false;
        }

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
        let { isPanelOpen, isDragOver, files } = this.state;

        //<span className="file__error">{ file.error }</span>
        //<span className="file__id">{ file.id } </span>
        //<span className="file__type">{ file.type } </span>
        //<span className="file__size">{ file.size / 1000 / 1000 } MB</span>
        //<span className="file__status">
          //  {this.getStatusString(file.status)}
        //</span>

        return (
            <Flex wrap>
                <Box col={12} lg={6} sm={6}>
                    <div className="padding-10">
                        <FileReceiver
                            ref="uploadPanel"
                            customClass="upload-panel"
                            isOpen={isPanelOpen}
                            onDragOver={this.onDragOver}
                            onFileDrop={this.onFileDrop}>
                            <p>
                                {!isDragOver ? 'Drop here' : 'Files detected'}
                            </p>
                        </FileReceiver>
                    </div>
                </Box>
                <Box col={12} lg={6} sm={6}>
                    <div className="padding-10">
                        <p>Upload List</p>
                        <FileUploadManager
                            customClass="upload-list"
                            files={files}
                            uploadUrl="/upload"
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