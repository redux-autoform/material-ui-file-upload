import React, { Component, PropTypes } from 'react';
import Status from '../constant/FileStatus';
import { LinearProgress, ListItem, IconButton, IconMenu, MenuItem } from 'material-ui';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import fileSize from 'filesize';
import { MarginTopDivWrapper, LeftSpan, RightSpan } from './BaseComponents';

const debug = require('debug')('react-file-upload:FileUploadHandler');

class FileUploadHandler extends Component {
    componentDidMount() {
        const { file, upload, autoStart } = this.props;

        if (file.status === Status.PENDING && autoStart) {
            debug('autoStart in on, calling upload()');
            upload(file);
        }
    }

    render() {
        const { file, innerDivStyle, style } = this.props;

        return (
            <ListItem
                leftIcon={<FileIcon/>}
                primaryText={file.name}
                secondaryText={this.secondaryText()}
                secondaryTextLines={2}
                rightIconButton={this.iconButton()}
                innerDivStyle={innerDivStyle}
                style={style}
            />
        );
    }

    progressToText = () => {
        let { progress } = this.props.file;
        return (progress === 100) ? 'Completed' : `${progress}% Done`;
    };

    toUploadSpeedOrFileSize = () => {
        let { progress, size } = this.props.file;
        return (progress === 100) ? fileSize(size) : `${fileSize((size * progress)/100)}/s`;
    };

    iconButton = () => {
        let { progress } = this.props.file;

        if (progress === 100) {
            const iconButtonElement = (
                <IconButton
                    touch
                >
                    <MoreVertIcon/>
                </IconButton>
            );

            return (
                <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem leftIcon={<DeleteIcon/>}>
                        Delete
                    </MenuItem>
                    <MenuItem leftIcon={<DownloadIcon/>}>
                        Download
                    </MenuItem>
                </IconMenu>
            );
        } else {
            return (
                <IconButton>
                    <ClearIcon color="red"/>
                </IconButton>
            );
        }
    };

    secondaryText = () => {
        let { progress } = this.props.file;

        return (
            <MarginTopDivWrapper>
                <LinearProgress min={0} max={100} value={progress} mode="determinate"/>
                <MarginTopDivWrapper>
                    <LeftSpan>
                        {this.progressToText()}
                    </LeftSpan>
                    <RightSpan>
                        {this.toUploadSpeedOrFileSize()}
                    </RightSpan>
                </MarginTopDivWrapper>
            </MarginTopDivWrapper>
        );
    }
}

FileUploadHandler.propTypes = {
    autoStart: PropTypes.bool,
    file: PropTypes.object,
    id: PropTypes.string,
    innerDivStyle: PropTypes.object,
    style: PropTypes.object,
    upload: PropTypes.func,
};

export default FileUploadHandler;
