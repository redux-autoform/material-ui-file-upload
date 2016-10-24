import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import shortId from 'shortid';
import status from '../constant/FileStatus';
import CloudIcon from 'material-ui/svg-icons/file/cloud-upload';
import { Title, CenteredIconBox } from './BaseComponents';
import DropZone from 'react-dropzone';
import { Flex, Box } from 'reflexbox';

class FileUploadReceiver extends Component {

    onFileDrop = (acceptedFiles) => {
        const files = [];

        const fileList = acceptedFiles || [];

        for (let i = 0; i < fileList.length; i++) {
            fileList[i].id = shortId.generate();
            fileList[i].status = status.PENDING;
            fileList[i].uploadDate = Date.now();
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
                    <Flex className="full-height" align="center" justify="center" column>
                        <Box py={4}>
                            <CenteredIconBox>
                                <CloudIcon color="#424242" style={{ width: "200", height: "200" }}/>
                            </CenteredIconBox>
                            <Title>Drag Files to Upload or <a onClick={this.openOnClick}>browse</a></Title>
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
