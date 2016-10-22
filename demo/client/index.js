import React from 'react';
import ReactDOM from 'react-dom';
import FileUpload from '../shared/components/FileUpload';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

ReactDOM.render(
    <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <FileUpload title="react-file-uploader"/>
    </MuiThemeProvider>,
    document.getElementById('app')
);