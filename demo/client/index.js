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
        <Flex
            align="center"
            justify="center"
            m={1}
            wrap
        >
            <Box
                col={12}
                lg={12}
                sm={12}
            >
                <Card containerStyle={{ width: "100%", height: "100%" }}>
                    <CardTitle title="File Upload Demo" titleStyle={{ paddingLeft: "10px" }}/>
                    <CardText>
                        <FileUpload/>
                    </CardText>
                </Card>
            </Box>
        </Flex>
    </MuiThemeProvider>
);

ReactDOM.render(<App/>, document.getElementById('app'));