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
    EDIT_PRODUCT,
    EDIT_PRODUCT_LOADED,
    EDIT_PRODUCT_UNLOADED,
    CATEGORY_PAGE_LOADED,
    CATEGORY_PAGE_UNLOADED,
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
    categories: state.category.categories,
    inProgress: state.product.inProgress,
    product: state.product.product,
    home: state.home
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({ type: EDIT_PRODUCT_LOADED, payload }),
    onLoadCategories: (payload) =>
        dispatch({ type: CATEGORY_PAGE_LOADED, payload }),
    onUnloadCategories: () =>
        dispatch({ type: CATEGORY_PAGE_UNLOADED }),

    onSubmit: product => {
        const payload = agent.Products.update(product);
        dispatch({ type: EDIT_PRODUCT, payload })
    },
    onUnload: () =>
        dispatch({ type: EDIT_PRODUCT_UNLOADED })
});

class EditProduct extends React.Component {
    constructor() {
        super();

        this.state = {
            productName: '',
            quantity: '',
            unit: '',
            categoryId: 0,
            errors: {
                productName: '',
                quantity: '',
                unit: '',
                categoryId: '',
            }
        };






        const reportError = (field, message) => {
            this.setState(preState => ({ ...preState, errors: { ...preState.errors, [field]: message, } }));
        };

        const reportErrorProductName = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The product name cannot be blank' : '';
            reportError('productName', message);
            return bInValid;
        };

        this.blurProductName = ev => {
            reportErrorProductName(ev.target.value.trim());
        };

        const reportErrorQuantity = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The quantity cannot be blank' : '';
            reportError('quantity', message);
            return bInValid;
        };

        this.blurQuantity = ev => {
            reportErrorQuantity(ev.target.value.trim());
        };

        const reportErrorCategoryId = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The category cannot be blank' : '';
            reportError('CategoryId', message);
            return bInValid;
        };

        this.blurCategoryId = ev => {
            reportErrorCategoryId(ev.target.value.trim());
        };


        const updateFieldValueEvent =
            key => ev => {
                let value = ev.target.value; //must be set the value here, ev.target become null in setState
                this.setState(preState => ({
                    ...preState,
                    [key]: value,
                }));
            };

        this.changeProductName = updateFieldValueEvent('productName');
        this.changeQuantity = updateFieldValueEvent('quantity');
        this.changeUnit = updateFieldValueEvent('unit');
        this.changeCategoryId = updateFieldValueEvent('categoryId');

        this.submitForm = () => ev => {
            ev.preventDefault();


            const {
                productName,
                quantity,
                unit,
                categoryId,
            } = this.state;

            let bInValid = reportErrorProductName(productName)
                || reportErrorQuantity(quantity)
                || reportErrorCategoryId(categoryId);


            if (bInValid) {
                return false;
            }

            let quantityNumber = parseFloat(quantity);
            if (isNaN(quantityNumber))
                quantityNumber = 0;
            const product = {
                productId: this.props.home.entityId,
                productName,
                quantity: quantityNumber,
                unit,
                categoryId,
            };
            this.props.onSubmit(product);
        }
    };

    componentDidMount() {

        this.props.onLoadCategories(agent.Categories.getAll());

        if (this.props.home
            && this.props.home.renderComponent
            && this.props.home.renderComponent === "EditProduct"
            && this.props.home.entityId > 0) {
            this.props.onLoad(agent.Products.getById(this.props.home.entityId));
        }

    }


    componentWillUnmount() {
        this.props.onUnload();
        this.props.onUnloadCategories();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.product && this.props.product && this.props.product.productId > 0
        ) {
            this.setState(preState => ({
                ...preState,
                productName: this.props.product.productName,
                quantity: this.props.product.quantity,
                unit: this.props.product.unit,
                categoryId: this.props.product.categoryId,
            }));
        }
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
                    <h1>Edit Product</h1>
                </Grid>
                <Grid item>
                    <ListErrors errors={this.state.errors} />
                </Grid>

                <Grid item>

                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm()}>
                        <TextField
                            required
                            id="productName"
                            value={this.state.productName}
                            label="Product Name, Required"
                            style={{ margin: 8 }}
                            placeholder="Product Name"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeProductName}
                            autoFocus
                            onBlur={this.blurProductName}
                            error={this.state.errors.productName.length === 0 ? false : true}
                            helperText={this.state.errors.productName}
                        />
                        <TextField
                            required
                            id="quantity"
                            value={this.state.quantity}
                            label="Quantity, Required"
                            style={{ margin: 8 }}
                            placeholder="Quantity"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeQuantity}
                            onBlur={this.blurQuantity}
                            error={this.state.errors.quantity.length === 0 ? false : true}
                            helperText={this.state.errors.quantity}
                        />
                        <TextField
                            required
                            id="unit"
                            value={this.state.unit}
                            label="Unit"
                            style={{ margin: 8 }}
                            placeholder="Unit"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeUnit}
                        />

                        <TextField
                            select
                            required
                            id="outlined-select-currency-native"
                            value={this.state.categoryId}
                            label="Category, Required"
                            style={{ margin: 8, textAlign: 'left' }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeCategoryId}
                        >
                            <option key='0' value='0'>
                                --- Please Select One Category ---
                                </option>
                            {this.props.categories ?
                                this.props.categories.map((option) => (
                                    <option key={option.categoryId} value={option.categoryId}>
                                        {option.categoryName}
                                    </option>
                                ))
                                :
                                null}
                        </TextField>

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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditProduct)));
