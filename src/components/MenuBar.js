import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
    UPDATE_REDIRECT_TO,
} from '../constants/actionTypes';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuRoot: {
        '& > * + *': {
            marginLeft: theme.spacing(5),
        },
    },
});

const mapStateToProps = state => ({
    categoryName: state.category.categoryName,
    inProgress: state.category.inProgress,
    categories: state.category.categories,
});

const mapDispatchToProps = dispatch => ({
    gotoComponent: component =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: component }),
});

class MenuBar extends React.Component {
    constructor() {
        super();

        this.onGotoComponent = this.onGotoComponent.bind(this);
    }
    onGotoComponent = component => ev => {
        ev.preventDefault();
        this.props.gotoComponent(component);
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography className={classes.menuRoot}>
                            <Link href="#" onClick={this.onGotoComponent('CategoriesList')} color="inherit">
                                Category
                        </Link>
                            <Link href="#" onClick={this.onGotoComponent('ProductsList')} color="inherit">
                                Product
                        </Link>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MenuBar)));
