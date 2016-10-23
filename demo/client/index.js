import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FileUpload from '../../lib/FileUpload';
import { Card, CardTitle, CardText } from 'material-ui';
import { Flex, Box } from 'reflexbox';
import tapEventPlugin from 'react-tap-event-plugin';

tapEventPlugin();

const App = (props, context) => (
    <MuiThemeProvider
        muiTheme={getMuiTheme(lightBaseTheme)}
    >
        <Flex wrap>
            <Box col={12} lg={12} sm={12} pt={4}>
                <Card>
                    <CardTitle title="File Upload Demo"/>
                    <CardText>
                        <FileUpload/>
                    </CardText>
                </Card>
            </Box>
        </Flex>
    </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('app'));