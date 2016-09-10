import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Receiver, UploadHandler, UploadManager, Status } from '../../../lib';
import _ from 'lodash';

class FileUpload extends Component {
    state = {
        isPanelOpen: false,
        isDragOver: false,
        files: []
    };

    openPanel = () => {
        this.setState({isPanelOpen: true});
    };

    closePanel = () => {
        this.setState({isPanelOpen: false});
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

        files.map((_file) => {
            if (_file.size > 1000 * 1000) {
                _file.status = Status.FAILED;
                _file.error = 'file size exceeded maximum'
            }
        });

        this.setState({
            files: this.state.files.concat(files)
        });

        // if you want to close the panel upon file drop
        this.closePanel();
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

    getStatusString = (status) => {
        switch (status) {
            case Status.FAILED:
                return 'failed';
                break;

            case Status.PENDING:
                return 'pending';
                break;

            case Status.UPLOADING:
                return 'uploading';
                break;

            case Status.UPLOADED:
                return 'uploaded';
                break;
        }
    };

    render() {
        let { isPanelOpen, isDragOver, files } = this.state;

        return (
            <div>
                <h1>{ this.props.title }</h1>
                <p>You can upload files with size with 1 MB at maximum</p>
                <Receiver
                    ref="uploadPanel"
                    customClass="upload-panel"
                    isOpen={isPanelOpen}
                    onDragEnter={this.openPanel}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.closePanel}
                    onFileDrop={this.onFileDrop}>
                    <p>
                        {
                            !isDragOver ? 'Drop here' : 'Files detected'
                        }
                    </p>
                </Receiver>
                <div>
                    <p>Upload List</p>
                    <UploadManager
                        customClass="upload-list"
                        files={files}
                        uploadUrl="/upload"
                        onUploadStart={this.onFileUpdate}
                        onUploadProgress={_.debounce(this.onFileProgress, 150)}
                        onUploadEnd={this.onFileUpdate}
                    >
                        {
                            files.map((file, index) => {
                                return (
                                    <UploadHandler key={index} id={`upload-handler-${index}`} file={file} autoStart>
                                        <dl>
                                            <dh>{ file.name }</dh>
                                            <dd>
                                                <span className="file__id">{ file.id } </span>
                                                <span className="file__type">{ file.type } </span>
                                                <span className="file__size">{ file.size / 1000 / 1000 } MB</span>
                                                <span className="file__progress">{ file.progress }%</span>
                                                <span className="file__status">
                                                    {this.getStatusString(file.status)}
                                                </span>
                                                <span className="file__error">{ file.error }</span>
                                            </dd>
                                        </dl>
                                    </UploadHandler>
                                )
                            })
                        }
                    </UploadManager>
                </div>
            </div>
        );
    }
}

export default FileUpload;