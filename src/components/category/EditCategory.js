import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import agent from '../../agent';
import {
    EDIT_CATEGORY,
    EDIT_CATEGORY_LOADED,
    EDIT_CATEGORY_UNLOADED
} from '../../constants/actionTypes';
import ListErrors from '../ListErrors';




const styles = theme => ({
    form: {
        textAlign: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(3, 1, 1, 1),
    },
    captcha: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    captchaAgain: {
        margin: theme.spacing(0, 1),
    },
    img: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '3px',
        margin: theme.spacing(0, 1),
    },
    contentDiv: {
        margin: theme.spacing(1),
    },
    fabButtonIcon: {
        marginRight: theme.spacing(0.5),
    },
    rootDialogActions: {
        justifyContent: 'center',
    }

});

const mapStateToProps = state => ({
    inProgress: state.category.inProgress,
    category: state.category.category,
    home: state.home
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({ type: EDIT_CATEGORY_LOADED, payload }),

    onSubmit: category => {
        const payload = agent.Categories.update(category);
        dispatch({ type: EDIT_CATEGORY, payload })
    },
    onUnload: () =>
        dispatch({ type: EDIT_CATEGORY_UNLOADED })
});

class EditCategory extends React.Component {
    constructor() {
        super();

        this.state = {
            categoryName: '',
            errors: {
                categoryName: '',
            }
        };






        const reportError = (field, message) => {
            this.setState(preState => ({ ...preState, errors: { ...preState.errors, [field]: message, } }));
        };

        const reportErrorcategoryName = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The category name cannot be blank' : '';
            reportError('categoryName', message);
            return bInValid;
        };

        this.blurcategoryName = ev => {
            reportErrorcategoryName(ev.target.value.trim());
        };


        const updateFieldValueEvent =
            key => ev => {
                let value = ev.target.value; //must be set the value here, ev.target become null in setState
                this.setState(preState => ({
                    ...preState,
                    [key]: value,
                }));
            };

        this.changecategoryName = updateFieldValueEvent('categoryName');

        this.submitForm = () => ev => {
            ev.preventDefault();


            const {
                categoryName,
            } = this.state;

            let bInValid = reportErrorcategoryName(categoryName);


            if (bInValid) {
                return false;
            }

            const category = {
                categoryId: this.props.home.entityId,
                categoryName,
            };
            this.props.onSubmit(category);
        }
    };



    componentDidMount() {

        if (this.props.home
            && this.props.home.renderComponent
            && this.props.home.renderComponent === "EditCategory"
            && this.props.home.entityId > 0) {
            this.props.onLoad(agent.Categories.getById(this.props.home.entityId));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.category && this.props.category && this.props.category.categoryId > 0
        ) {
            this.setState(preState => ({
                ...preState,
                categoryName: this.props.category.categoryName,
            }));
        }
    }



    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {

        const { classes } = this.props;

        return (

            <Grid container direction="column"
                justify="center"
                alignItems="center"
                alignContent="center"
            >
                <Grid item>
                    <h1>Edit category</h1>
                </Grid>
                <Grid item>
                    <ListErrors errors={this.state.errors} />
                </Grid>

                <Grid item>

                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm()}>
                        <TextField
                            required
                            id="categoryName"
                            value={this.state.categoryName}
                            label="Category Name, Required"
                            style={{ margin: 8 }}
                            placeholder="Category Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changecategoryName}
                            autoFocus
                            onBlur={this.blurcategoryName}
                            error={this.state.errors.categoryName.length === 0 ? false : true}
                            helperText={this.state.errors.categoryName}
                        />


                        <Fab
                            variant="extended"
                            size="small"
                            color="primary"
                            aria-label="send-application"
                            className={classes.button}
                            type="submit"
                            disabled={this.props.inProgress}
                        >
                            <SaveIcon className={classes.fabButtonIcon} />
                                Save
                            </Fab>

                    </form>
                </Grid>
            </Grid>

        );
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditCategory)));
