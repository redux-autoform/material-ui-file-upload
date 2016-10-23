import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import shortId from 'shortid';
import status from '../constant/FileStatus';
import DropZone from 'react-dropzone';
import { Flex, Box } from 'reflexbox';

class FileUploadReceiver extends Component {

    onFileDrop = (acceptedFiles) => {
        const files = [];

        const fileList = acceptedFiles || [];

        for (let i = 0; i < fileList.length; i++) {
            fileList[i].id = shortId.generate();
            fileList[i].status = status.PENDING;
            fileList[i].progress = 0;
            fileList[i].src = null;

            files.push(fileList[i]);
        }

        this.props.onFileDrop(files);
    };

    onRef = (node) => {
        this.dropzone = node;
    };

    openOnClick = () => {
        this.dropzone.open();
    };

    render() {
        const { isOpen, customClass, style } = this.props;

        if (isOpen) {
            return (
                <DropZone
                    ref={this.onRef}
                    onDrop={this.onFileDrop}
                    className={cx(customClass)}
                    style={style}
                    multiple
                >
                    <Flex className="full-height-100" align="center" justify="center" column>
                        <Box py={4}>
                            <img className="full-width" src="../../image/cloud.svg"/>
                            <p>Drag Files to Upload or <a onClick={this.openOnClick}>browse</a></p>
                        </Box>
                    </Flex>
                </DropZone>
            )
        }

        return null;
    }
}

FileUploadReceiver.propTypes = {
    customClass: PropTypes.string,
    isOpen: PropTypes.bool,
    onFileDrop: PropTypes.func,
    style: PropTypes.object,
};

export default FileUploadReceiver;
