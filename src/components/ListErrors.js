import { withStyles } from '@material-ui/core/styles';
import React from 'react';

const styles = theme => ({
    errorMessages: {
        color: 'red',
    },
});

class ListErrors extends React.Component {

    render() {
        //{key}: {msg}
        const { classes } = this.props;

        const liRender = (key, msg) => {
            if (msg) {
                return (
                    <li key={key}>
                        {msg}
                    </li>
                );
            } else {
                return null;
            }
        };
        const errors = this.props.errors;
        if (errors && Object.keys(errors).find(key => errors[key].length > 0)) {
            return (
                <ul className={classes.errorMessages}  key='listErrorULKey'>
                    {
                        Object.keys(errors).map(key => {
                            return (
                                <React.Fragment key={key.toString()}>
                                    {liRender(key, errors[key])}
                                </React.Fragment>
                            );
                        })
                    }
                </ul>
            );
        } else {
            return null;
        }
    }
}

export default withStyles(styles)(ListErrors);
