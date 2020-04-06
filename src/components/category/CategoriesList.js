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
    CATEGORY_PAGE_LOADED,
    CATEGORY_PAGE_UNLOADED,
    UPDATE_REDIRECT_TO,
    DELETE_CATEGORY
} from '../../constants/actionTypes';





const columns = [
    {
        id: 'categoryId',
        label: 'ID',
        align: 'left',
    },
    {
        id: 'categoryName',
        label: 'Category Name',
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
});

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: CATEGORY_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: CATEGORY_PAGE_UNLOADED }),
    gotoCreateCategory: () =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'CreateCategory' }),
    gotoEditCategory: (entityId) =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'EditCategory', entityId }),
    deleteCategory: (categoryId) => {
        const payload = agent.Categories.delete(categoryId);
        dispatch({ type: DELETE_CATEGORY, payload, categoryId })
    },
});

class CategoriesList extends React.Component {
    constructor() {
        super();


        this.onGotoCreateCategory = this.onGotoCreateCategory.bind(this);
        this.onGotoEditCategory = this.onGotoEditCategory.bind(this);

    }


    onGotoCreateCategory = ev => {
        ev.preventDefault();
        this.props.gotoCreateCategory();

    };
    onGotoEditCategory = categoryId => ev => {
        ev.preventDefault();
        this.props.gotoEditCategory(categoryId);

    };
    onDeleteCategory = categoryId => ev => {
        ev.preventDefault();
        if (window.confirm('Are you sure to delete the category?') == true)
            this.props.deleteCategory(categoryId);

    };

    componentDidMount() {
        this.props.onLoad(agent.Categories.getAll());
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {

        const { classes } = this.props;

        if (!this.props.categories) {
            return (
                <div className={classes.centerLoading}>
                    <Typography variant="h6">Loading...</Typography>
                    <CircularProgress size={64} color="secondary" />
                </div>
            );
        }
        else if (this.props.categories.length === 0) {
            return (
                <Typography variant="h6" className={classes.centerLoading}>No Category</Typography>
            );
        }
        else {
            return (
                <Fragment>

                    <Grid container spacing={3} justify='center' alignContent='center' alignItems='center'>
                        <Grid item xs={10} className={classes.leftFlex}>
                            <Typography variant="h4" component="div">
                                Categories
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
                                onClick={this.onGotoCreateCategory}
                            >
                                <AddIcon className={classes.fabButtonIconLeft} />
                                                                        Create
                                                                </Fab>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.root}>
                                <TableContainer component={Paper}>
                                    <Table stickyHeader aria-label="category list table" size='small'>
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
                                                this.props.categories.map(row => {
                                                    return (
                                                        <StyledTableRow hover tabIndex={-1} key={row.categoryId}>
                                                            {columns.slice(0, columns.length - 2).map(column => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <StyledTableCell key={column.id} align={column.align}>
                                                                        {column.format && value ? column.format(value) : value}
                                                                    </StyledTableCell>
                                                                );
                                                            })}
                                                            <StyledTableCell key={columns[columns.length - 2].id} align={columns[columns.length - 2].align}>
                                                                <Fab
                                                                    variant="extended"
                                                                    size="small"
                                                                    color="primary"
                                                                    aria-label="view-details"
                                                                    className={classes.button}
                                                                    type="button"
                                                                    onClick={this.onGotoEditCategory(row.categoryId)}
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
                                                                    onClick={this.onDeleteCategory(row.categoryId)}
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CategoriesList)));

