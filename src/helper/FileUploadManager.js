import React, { Component, PropTypes, cloneElement } from 'react';
import invariant from 'invariant';
import assign from 'lodash/assign';
import bindKey from 'lodash/bindKey';
import clone from 'lodash/clone';
import request from 'superagent';
import Status from '../constant/FileStatus';
import cx from 'classnames';
import { List, Subheader } from 'material-ui';
import FileIcon from 'material-ui/svg-icons/editor/insert-drive-file';
import { Flex, Box } from 'reflexbox';
import { ScrollableDivWrapper, Title, SubTitle, CenteredIconBox } from './BaseComponents';
import _ from 'lodash';

const debug = require('debug')('react-file-upload:FileUploadManager');

class FileUploadManager extends Component {

    componentDidMount() {
        invariant(
            !!this.props.uploadUrl,
            'Upload end point must be provided to upload files'
        );

        invariant(
            !!this.props.onUploadEnd,
            'onUploadEnd function must be provided'
        );
    }

    upload = (url, file) => {
        const {
            onUploadStart,
            onUploadEnd,
            onUploadProgress,
            uploadErrorHandler,
            uploadHeader = {},
        } = this.props;

        if (typeof onUploadStart === 'function') {
            onUploadStart(assign(file, { status: Status.UPLOADING }));
        }

        const formData = new FormData();
        formData.append('file', file);

        debug(`start uploading file#${file.id} to ${url}`, file);

        request
            .post(url)
            .accept('application/json')
            .set(uploadHeader)
            .send(formData)
            .on('progress', ({ percent }) => {
                if (typeof onUploadProgress === 'function') {
                    onUploadProgress(assign(file, {
                        progress: percent,
                        status: Status.UPLOADING,
                    }));
                }
            })
            .end((err, res) => {
                const { error, result } = uploadErrorHandler(err, res);

                if (error) {
                    debug('failed to upload file', error);

                    if (typeof onUploadEnd === 'function') {
                        onUploadEnd(assign(file, { error, status: Status.FAILED }));
                    }

                    return;
                }

                debug('succeeded to upload file', res);

                if (typeof onUploadEnd === 'function') {
                    onUploadEnd(assign(file, { result, status: Status.UPLOADED }));
                }
            });
    };

    getChildren = () => {
        const { children, uploadUrl } = this.props;

        return React.Children.map(children, child => cloneElement(child, assign({upload: bindKey(this, 'upload', uploadUrl, child.props.file)}, child.props)));
    };

    render() {
        const { style, customClass, children } = this.props;
        let child = null;

        if (!_.isEmpty(children)) {
            child = (
                <ScrollableDivWrapper>
                    <List style={style}>
                        {this.getChildren()}
                    </List>
                </ScrollableDivWrapper>
            )
        } else {
            child = (
                <Flex align="center" justify="center" column>
                    <Box py={4}>
                        <CenteredIconBox>
                            <FileIcon color="#424242" style={{ width: "200", height: "200" }}/>
                        </CenteredIconBox>
                        <Title>Ups, You have no files</Title>
                        <SubTitle>Start by Dragging some files</SubTitle>
                    </Box>
                </Flex>
            )
        }

        return (
            <div className={cx(customClass)}>
                <Subheader style={{ color: "#424242", backgroundColor: "#F5F5F5" }}>
                    Recently Uploaded Files
                </Subheader>
                {child}
            </div>
        );
    }
}

FileUploadManager.propTypes = {
    customClass: PropTypes.string,
    children: PropTypes.array,
    onUploadStart: PropTypes.func,
    onUploadProgress: PropTypes.func,
    onUploadEnd: PropTypes.func,
    style: PropTypes.object,
    uploadErrorHandler: PropTypes.func,
    uploadUrl: PropTypes.string,
    uploadHeader: PropTypes.object,
};

FileUploadManager.defaultProps = {
    uploadErrorHandler: (err, res) => {
        let error = null;
        const body = clone(res.body);

        if (err) {
          error = err.message;
        } else if (body && body.errors) {
          error = body.errors;
        }

        delete body.errors;

        return { error, result: body };
    },
};

export default FileUploadManager;
