import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Status from './constants/Status';

const debug = require('debug')('react-file-upload:UploadHandler');

class UploadHandler extends Component {
    componentDidMount() {
        const { file, upload, autoStart } = this.props;

        if (file.status === Status.PENDING && autoStart) {
            debug('autoStart in on, calling upload()');
            upload(file);
        }
    }

    getStatusString = (status) => {
        switch (status) {
            case Status.FAILED:
                return 'failed';

            case Status.PENDING:
                return 'pending';

            case Status.UPLOADING:
                return 'uploading';

            case Status.UPLOADED:
                return 'uploaded';

            default:
                return '';
        }
    };

    render() {
        const { component, id, customClass, style, children } = this.props;

        return React.createElement(component, { id, className: classNames(customClass), style }, children);
    }
}

UploadHandler.propTypes = {
    autoStart: PropTypes.bool,
    children: PropTypes.object,
    component: PropTypes.string,
    customClass: PropTypes.array,
    file: PropTypes.object,
    id: PropTypes.string,
    style: PropTypes.object,
    upload: PropTypes.func,
};

UploadHandler.defaultProps = {
    component: 'li',
};

export default UploadHandler;
