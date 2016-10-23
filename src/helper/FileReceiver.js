import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import classNames from 'classnames';
import shortid from 'shortid';
import status from '../constant/FileStatus';

class Receiver extends Component {

    // this is to monitor the hierarchy
    // for window onDragEnter event
    state = {
        dragLevel: 0,
    };

    componentDidMount() {
        invariant(
            !!window.DragEvent && !!window.DataTransfer,
            'Upload end point must be provided to upload files'
        );

        window.addEventListener('dragenter', this.onDragEnter);
        window.addEventListener('dragleave', this.onDragLeave);
        window.addEventListener('dragover', this.onDragOver);
        window.addEventListener('drop', this.onFileDrop);
    }

    componentWillUnmount() {
        window.removeEventListener('dragenter', this.onDragEnter);
        window.removeEventListener('dragleave', this.onDragLeave);
        window.removeEventListener('dragover', this.onDragOver);
        window.removeEventListener('drop', this.onFileDrop);
    }

    onDragEnter = (e) => {
        const dragLevel = this.state.dragLevel + 1;

        this.setState({ dragLevel });

        if (!this.props.isOpen) {
            this.props.onDragEnter(e);
        }
    };

    onDragLeave = (e) => {
        const dragLevel = this.state.dragLevel - 1;

        this.setState({ dragLevel });

        if (dragLevel === 0) {
            this.props.onDragLeave(e);
        }
    };

    onDragOver = (e) => {
        e.preventDefault();
        this.props.onDragOver(e);
    };

    onFileDrop = (e) => {
        // eslint-disable-next-line no-param-reassign
        e = e || window.event;
        e.preventDefault();

        const files = [];

        if (!!e.dataTransfer) {
            const fileList = e.dataTransfer.files || [];

            for (let i = 0; i < fileList.length; i ++) {
                fileList[i].id = shortid.generate();
                fileList[i].status = status.PENDING;
                fileList[i].progress = 0;
                fileList[i].src = null;

                files.push(fileList[i]);
            }
        }

        // reset drag level once dropped
        this.setState({ dragLevel: 0 });

        this.props.onFileDrop(e, files);
    };

    render() {
        const { isOpen, customClass, style, children } = this.props;

        if (isOpen) {
            return (
                <div className={classNames(customClass)} style={style}>
                    {children}
                </div>
            )
        }

        return null;
    }
}

Receiver.propTypes = {
    children: PropTypes.object,
    customClass: PropTypes.string,
    isOpen: PropTypes.bool,
    onDragEnter: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onFileDrop: PropTypes.func,
    style: PropTypes.object,
};

export default Receiver;
