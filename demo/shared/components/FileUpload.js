import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Receiver, UploadHandler, UploadManager, Status } from '../../../lib';
import _ from 'lodash';
import { LinearProgress, ListItem, Divider, IconButton } from 'material-ui';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import fileSize from 'filesize';

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

    progressToText = ({ progress }) => {
        return (progress === 100) ? 'Completed' : `${progress}% Done`;
    };

    toUploadSpeedOrFileSize = ({ progress, size }) => {
        return (progress === 100) ? fileSize(size) : `${fileSize((size * progress)/100)}/s`;
    };

    iconButton = ({ progress }) => {
        let icon = (progress === 100) ? <DeleteIcon/> : <ClearIcon color="red"/>;

        return (
            <IconButton>
                {icon}
            </IconButton>
        )
    };

    render() {
        let { isPanelOpen, isDragOver, files } = this.state;
        let { title, subtitle } = this.props;

        //<span className="file__error">{ file.error }</span>
        //<span className="file__id">{ file.id } </span>
        //<span className="file__type">{ file.type } </span>
        //<span className="file__size">{ file.size / 1000 / 1000 } MB</span>
        //<span className="file__status">
          //  {this.getStatusString(file.status)}
        //</span>

        return (
            <div>
                <h1>{title}</h1>
                <p>You can upload files with size with 1 MB at maximum</p>
                <Receiver
                    ref="uploadPanel"
                    customClass="upload-panel"
                    isOpen={isPanelOpen}
                    onDragOver={this.onDragOver}
                    onFileDrop={this.onFileDrop}>
                    <p>
                        {!isDragOver ? 'Drop here' : 'Files detected'}
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
                            files.map((file, index) => (
                                <UploadHandler key={index} id={`upload-handler-${index}`} file={file} autoStart>
                                    <ListItem
                                        leftIcon={<FileIcon/>}
                                        primaryText={file.name}
                                        secondaryTextLines={2}
                                        secondaryText={
                                            <div className="margin-top-10">
                                                <LinearProgress min={0} max={100} mode="determinate" value={file.progress}/>
                                                <div className="margin-top-5">
                                                    <span className="left">{this.progressToText(file)}</span>
                                                    <span className="right">{this.toUploadSpeedOrFileSize(file)}</span>
                                                </div>
                                            </div>
                                        }
                                        rightIconButton={this.iconButton(file)}
                                    />
                                    <Divider inset/>
                                </UploadHandler>
                            ))
                        }
                    </UploadManager>
                </div>
            </div>
        );
    }
}

export default FileUpload;