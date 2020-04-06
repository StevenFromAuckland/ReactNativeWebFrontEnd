import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MenuBar from './MenuBar';
import CategoriesList from './category/CategoriesList';
import CreateCategory from './category/CreateCategory';
import EditCategory from './category/EditCategory';
import ProductsList from './product/ProductsList';
import CreateProduct from './product/CreateProduct';
import EditProduct from './product/EditProduct';

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    tileArea: {
        margin: '16px',
    },
}));

const mapStateToProps = state => ({
    renderComponent: state.home.renderComponent,
});


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderComponent: '',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.renderComponent !== this.props.renderComponent ) {
            this.setState({
                renderComponent: this.props.renderComponent,
            });
        }
    }

    render() {
        const { classes } = this.props;

        let renderComponent = <CategoriesList />;
        switch (this.props.renderComponent) {
            //case 'CategoriesList':
            //    renderComponent = <CategoriesList />;
            //    break;
            case 'CreateCategory':
                renderComponent = <CreateCategory />;
                break;
            case 'EditCategory':
                renderComponent = <EditCategory />;
                break;
            case 'ProductsList':
                renderComponent = <ProductsList />;
                break;
            case 'CreateProduct':
                renderComponent = <CreateProduct />;
                break;
            case 'EditProduct':
                renderComponent = <EditProduct />;
                break;
        }

        return (
            <div className={classes.root}>
                <MenuBar />
                <div className={classes.tileArea}>
                    {renderComponent}
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, () => ({}))(App)));
