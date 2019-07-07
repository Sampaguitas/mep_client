import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import config from 'config';
import { currencyActions, opcoActions, projectActions, supplierActions, userActions, erpActions, screenActions, fieldnameActions  } from '../../_actions';
import { authHeader } from '../../_helpers';
import Layout from '../../_components/layout';
import Tabs from '../../_components/tabs/tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import General from './tabs/configuration/general';
import Suppliers from './tabs/configuration/suppliers';
import Fields from './tabs/configuration/fields';
import Screens from './tabs/configuration/screens';
import Documents from './tabs/configuration/documents';
import Duf from './tabs/configuration/duf';
import { EventEmitter } from 'events';

const tabs = [
    {index: 0, id: 'general', label: 'General', component: General, active: true, isLoaded: false},
    {index: 1, id: 'suppliers', label: 'Suppliers', component: Suppliers, active: false, isLoaded: false},
    {index: 2, id: 'fields', label: 'Fields', component: Fields, active: false, isLoaded: false},
    {index: 3, id: 'screens', label: 'Screens', component: Screens, active: false, isLoaded: false},
    {index: 4, id: 'documents', label: 'Documents', component: Documents, active: false, isLoaded: false},
    {index: 5, id: 'duf', label: 'DUF', component: Duf, active: false, isLoaded: false}
]

const _ = require('lodash');

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

class Configuration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submittedProject: false,
            projectId: ''
            // submittedSupplier: false,
            // showSupplierModal: false 
        }
        this.handleSelectionReload=this.handleSelectionReload.bind(this);
        this.handleSubmitProject=this.handleSubmitProject.bind(this);
        this.handleDeleteProject=this.handleDeleteProject.bind(this);
        // this.handleSubmitSupplier=this.handleSubmitSupplier.bind(this);
        // this.handleDeleteSupplier=this.handleDeleteSupplier.bind(this);
        // this.handleShowSupplierModal=this.handleShowSupplierModal.bind(this);
        // this.handleHideSupplierModal=this.handleHideSupplierModal.bind(this);
        this.handleDeleteFieldNames = this.handleDeleteFieldNames.bind(this);
        this.handleDeleteDocFields = this.handleDeleteDocFields.bind(this);
        this.handleDeleteDocDef = this.handleDeleteDocDef.bind(this);
        // this.handleDeleteFieldNamesApi = this.handleDeleteFieldNamesApi.bind(this);
        // this.handleResponse = this.handleResponse.bind(this);

    }

    componentDidMount(){
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
        }
        dispatch(currencyActions.getAll());
        dispatch(erpActions.getAll());
        dispatch(opcoActions.getAll());
        dispatch(userActions.getAll());
        dispatch(projectActions.getAll());
        dispatch(screenActions.getAll());
    }

    handleSelectionReload(event){
        // event.preventDefault();
        const { dispatch, location } = this.props
        var qs = queryString.parse(location.search);
        if (qs.id) {
            this.setState({projectId: qs.id}),
            dispatch(projectActions.getById(qs.id));
            console.log('stateReload');
        }
        dispatch(projectActions.getAll());     
    }

    handleSubmitProject(event, project) {
        event.preventDefault();
        const { dispatch } = this.props;
        this.setState({ submittedProject: true });
        if (project._id, project.name && project.erpId && project.opcoId) {
            dispatch(projectActions.update(project));
            this.setState({submittedProject: false})
        }
    }

    // handleSubmitSupplier(event, supplier) {
    //     event.preventDefault();
    //     const { dispatch } = this.props;
    //     this.setState({ submittedSupplier: true });
    //     if (supplier._id && supplier.name && supplier.projectId) {
    //         dispatch(supplierActions.create(supplier));
    //         this.setState({submittedSupplier: false},
    //             ()=> {this.handleHideSupplierModal(event)});
    //     } else if (supplier.name && supplier.projectId){
    //         dispatch(supplierActions.update(supplier));
    //         this.setState({submittedSupplier: false},
    //             ()=> {this.handleHideSupplierModal(event)})
    //     }
    // }

    handleDeleteProject(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(projectActions.delete(id));
    }

    // handleDeleteSupplier(event, id) {
    //     event.preventDefault();
    //     const { dispatch } = this.props
    //     dispatch(supplierActions.delete(id));
    // }

    handleDeleteFieldNames(event, id) {
        event.preventDefault();
        console.log('fields:',id);
        const requestOptions = {
            method: 'DELETE',
            headers: { ...authHeader()},
        };
    
        return fetch(`${config.apiUrl}/fieldName/delete?id=${JSON.stringify(id)}`, requestOptions)
        .then(this.handleSelectionReload());
    }

    handleDeleteDocFields(event, id) {

    }

    handleDeleteDocDef(event, id) {
        
    }

    // handleDeleteFieldNamesApi(id){
    //     event.preventDefault();
    //     console.log('fields:',id);
    //     const requestOptions = {
    //         method: 'DELETE',
    //         headers: { ...authHeader()},
    //     };
    
    //     return fetch(`${config.apiUrl}/fieldName/delete?id=${JSON.stringify(id)}`, requestOptions).then(this.handleResponse);
    // }

    // handleResponse(response) {
    //     return response.text().then(text => {
    //         if (text == 'Unauthorized') {
    //             logout();
    //             location.reload(true);
    //         }
    //         const data = text && JSON.parse(text);
    //         if (!response.ok) {
    //             if (response.status === 401) {
    //                 // auto logout if 401 response returned from api
    //                 logout();
    //                 location.reload(true);
    //             }
    //             const error = (data && data.message) || response.statusText;
    //             return Promise.reject(error);
    //         }
    //         return data;
            
    //     });
    // }


    // handleShowSupplierModal(event) {
    //     this.setState({showSupplierModal: true});
    // }

    // handleHideSupplierModal(event) {
    //     this.setState({showSupplierModal: false});
    // }    
    render() {
        const { 
                alert,  
                projectUpdating,
                projectDeleting,
                users,
                erps,
                opcos,
                currencies,
                screens,
                selection,
                // supplierUpdating,
                // supplierDeleting,
            } = this.props;
        
            const { 
                submittedProject, 
                projectId,
                // submittedSupplier,
                // showSupplierModal 
            } = this.state

            // let currentUser = JSON.parse(localStorage.getItem('user'));
        return (
            <Layout accesses={selection.project && selection.project.accesses}>
                {alert.message ? <div className={`alert ${alert.type}`}>{alert.message}</div>: <br />}
                <h2>Configuration : {selection.project ? selection.project.name : <FontAwesomeIcon icon="spinner" className="fa-pulse fa-1x fa-fw" />}</h2>
                <hr />
                <div id="configuration" className="full-height">
                    <Tabs
                        tabs={tabs}
                        handleSelectionReload={this.handleSelectionReload}
                        handleSubmitProject={this.handleSubmitProject}
                        handleDeleteProject={this.handleDeleteProject}
                        projectUpdating={projectUpdating}
                        projectDeleting={projectDeleting}
                        submittedProject={submittedProject}                    
                        users={users}
                        erps={erps}
                        opcos={opcos}
                        currencies={currencies}
                        screens={screens}
                        selection={selection}
                        // handleSubmitSupplier={this.handleSubmitSupplier}
                        // handleDeleteSupplier={this.handleDeleteSupplier}
                        // supplierUpdating={supplierUpdating}
                        // supplierDeleting={supplierDeleting}
                        // submittedSupplier={submittedSupplier}
                        // showSupplierModal={showSupplierModal}
                        // handleShowSupplierModal={this.handleShowSupplierModal}
                        // handleHideSupplierModal={this.handleHideSupplierModal}
                        handleDeleteFieldNames={this.handleDeleteFieldNames}
                        handleDeleteDocFields={this.handleDeleteDocFields}
                        handleDeleteDocDef={this.handleDeleteDocDef}
                        projectId={projectId}
                        // currentUser = {currentUser}
                    />
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { alert, currencies, opcos, users, selection, erps, screens  } = state;
    const { projectUpdating, projectDeleting } = state.projects;
    // const { supplierUpdating, supplierDeleting } = state.suppliers;
    return {
        alert,
        projectUpdating,
        projectDeleting,
        // supplierUpdating,
        // supplierDeleting,        
        users,
        erps,
        opcos,
        currencies,
        screens,
        selection,
    };
}

const connectedConfiguration = connect(mapStateToProps)(Configuration);
export { connectedConfiguration as Configuration };