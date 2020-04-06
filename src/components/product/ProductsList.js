import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import agent from '../../agent';
import {
    PRODUCT_PAGE_LOADED,
    PRODUCT_PAGE_UNLOADED,
    UPDATE_REDIRECT_TO,
    DELETE_PRODUCT,
    CATEGORY_PAGE_LOADED,
    CATEGORY_PAGE_UNLOADED,
} from '../../constants/actionTypes';





const columns = [
    {
        id: 'productId',
        label: 'ID',
        align: 'left',
    },
    {
        id: 'productName',
        label: 'Product Name',
        align: 'center',
    },
    {
        id: 'quantity',
        label: 'Quantity',
        align: 'center',
        format: (value) => value.toFixed(2)
    },
    {
        id: 'unit',
        label: 'Unit',
        align: 'center',
    },
    {
        id: 'categoryName',
        label: 'Category',
        align: 'center',
    },
    {
        id: 'Edit',
        label: '',
        align: 'center',
        width: '100px'
    },
    {
        id: 'Delete',
        label: '',
        align: 'right',
        width: '100px'
    },

];


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const NoBorderTableCell = withStyles(theme => ({
    root: {
        borderBottom: "none",
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            //backgroundColor: theme.palette.background.default,
            backgroundColor: '#EEE',
        },
    },
    hover: {
        '&:hover': {
            backgroundColor: 'orange !important',
        },
    },
}))(TableRow);


const styles = theme => ({
    root: {
        width: '100%',
    },
    pagingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(0.5),
    },
    fabButtonIconLeft: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
    fabButtonIcon: {
        marginRight: theme.spacing(1),
    },
    rootDialogActions: {
        justifyContent: 'center',
    },
    contentDiv: {
        margin: theme.spacing(1),
    },
    centerLoading: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'center',
        width: "100%",
    },
    fieldName: {
        fontWeight: 'bold',
    },
});

const mapStateToProps = state => ({
    categories: state.category.categories,
    products: state.product.products,
});

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: PRODUCT_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: PRODUCT_PAGE_UNLOADED }),
    gotoCreateProduct: () =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'CreateProduct' }),
    gotoEditProduct: (entityId) =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'EditProduct', entityId }),
    deleteProduct: (productId) => {
        const payload = agent.Products.delete(productId);
        dispatch({ type: DELETE_PRODUCT, payload, productId })
    },
    onLoadCategories: (payload) =>
        dispatch({ type: CATEGORY_PAGE_LOADED, payload }),
    onUnloadCategories: () =>
        dispatch({ type: CATEGORY_PAGE_UNLOADED }),

});

class ProductsList extends React.Component {
    constructor() {
        super();


        this.onGotoCreateProduct = this.onGotoCreateProduct.bind(this);
        this.onGotoEditProduct = this.onGotoEditProduct.bind(this);

    }


    onGotoCreateProduct = ev => {
        ev.preventDefault();
        this.props.gotoCreateProduct();

    };
    onGotoEditProduct = productId => ev => {
        ev.preventDefault();
        this.props.gotoEditProduct(productId);

    };
    onDeleteProduct = productId => ev => {
        ev.preventDefault();
        if (window.confirm('Are you sure to delete the product?') == true)
            this.props.deleteProduct(productId);

    };

    componentDidMount() {
        this.props.onLoadCategories(agent.Categories.getAll());
        this.props.onLoad(agent.Products.getAll());
    }

    componentWillUnmount() {
        this.props.onUnload();
        this.props.onUnloadCategories();
    }

    render() {

        const { classes } = this.props;

        if (!this.props.products) {
            return (
                <div className={classes.centerLoading}>
                    <Typography variant="h6">Loading...</Typography>
                    <CircularProgress size={64} color="secondary" />
                </div>
            );
        }
        else if (this.props.products.length === 0) {
            return (
                <Typography variant="h6" className={classes.centerLoading}>No Product</Typography>
            );
        }
        else {
            return (
                <Fragment>

                    <Grid container spacing={3} justify='center' alignContent='center' alignItems='center'>
                        <Grid item xs={10} className={classes.leftFlex}>
                            <Typography variant="h4" component="div">
                                Products
                                </Typography>
                        </Grid>
                        <Grid item xs={10} className={classes.leftFlex}>
                            <Fab
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="view-details"
                                className={classes.button}
                                type="button"
                                onClick={this.onGotoCreateProduct}
                            >
                                <AddIcon className={classes.fabButtonIconLeft} />
                                                                        Create
                                                                </Fab>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.root}>
                                <TableContainer component={Paper}>
                                    <Table stickyHeader aria-label="product list table" size='small'>
                                        <TableHead>
                                            <StyledTableRow>
                                                {columns.map(column => (
                                                    <StyledTableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={column.width ? { width: column.width } : {}}
                                                    >
                                                        {column.label}
                                                    </StyledTableCell>
                                                ))}
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.props.products.map(row => {
                                                    return (
                                                        <StyledTableRow hover tabIndex={-1} key={row.productId}>
                                                            {columns.slice(0, columns.length - 3).map(column => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <StyledTableCell key={column.id} align={column.align}>
                                                                        {column.format && value ? column.format(value) : value}
                                                                    </StyledTableCell>
                                                                );
                                                            })}
                                                            <StyledTableCell key='categoryId' align='center'>
                                                                {
                                                                    this.props.categories && this.props.categories.some(x => x.categoryId === row.categoryId) ?
                                                                        this.props.categories.find(x => x.categoryId === row.categoryId).categoryName
                                                                        :
                                                                        null}
                                                            </StyledTableCell>
                                                            <StyledTableCell key={columns[columns.length - 2].id} align={columns[columns.length - 2].align}>
                                                                <Fab
                                                                    variant="extended"
                                                                    size="small"
                                                                    color="primary"
                                                                    aria-label="view-details"
                                                                    className={classes.button}
                                                                    type="button"
                                                                    onClick={this.onGotoEditProduct(row.productId)}
                                                                >
                                                                    <EditIcon className={classes.fabButtonIconLeft} />
                                                                        Edit
                                                                </Fab>
                                                            </StyledTableCell>
                                                            <StyledTableCell key={columns[columns.length - 1].id} align={columns[columns.length - 1].align}>
                                                                <Fab
                                                                    variant="extended"
                                                                    size="small"
                                                                    color="primary"
                                                                    aria-label="view-details"
                                                                    className={classes.button}
                                                                    type="button"
                                                                    onClick={this.onDeleteProduct(row.productId)}
                                                                >
                                                                    <DeleteIcon className={classes.fabButtonIconLeft} />
                                                                        Delete
                                                                </Fab>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    );
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>



                </Fragment>

            );
        }
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ProductsList)));

