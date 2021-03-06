import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    accessActions,
    collitypeActions,
    docdefActions,
    docfieldActions,
    fieldActions,
    fieldnameActions,
    localeActions,
    opcoActions,
    poActions,
    projectActions,
    regionActions, 
    supplierActions,
} from '../../_actions';
import Modal from "../../_components/modal";
import Input from '../../_components/input';
import Layout from '../../_components/layout';
import Select from '../../_components/select';
import HeaderInput from '../../_components/project-table/header-input';

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        });
        return newArray;
    }
}

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array) {
        return true;
    } else {
        switch(type) {
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number': 
                return array == Number(search);
            case 'Boolean':
                if (Number(search) == 1) {
                return true;
                } else if (Number(search) == 2) {
                return !!array == 1;
                } else if (Number(search) == 3) {
                return !!array == 0;
                }
            default: return true;
        }
    }
}


class Opco extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            opco: {},
            code: "",
            name: "",
            city: "",
            country: "",
            region: "",
            submitted: false,
            show: false,
        };
        this.handleClearAlert = this.handleClearAlert.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleChangeOpco = this.handleChangeOpco.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleDeletOpco = this.handleDeletOpco.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // Clear Selection
        dispatch(accessActions.clear());
        dispatch(collitypeActions.clear());
        dispatch(docdefActions.clear());
        dispatch(docfieldActions.clear());
        dispatch(fieldActions.clear());
        dispatch(fieldnameActions.clear());
        dispatch(poActions.clear());
        dispatch(projectActions.clearSelection());
        dispatch(supplierActions.clear());
        //Get opcos, locales, regions
        dispatch(opcoActions.getAll());
        dispatch(localeActions.getAll());
        dispatch(regionActions.getAll());
        // var qs = queryString.parse(location.search);
    }

    handleClearAlert(event){
        event.preventDefault;
        const { dispatch } = this.props;
        dispatch(alertActions.clear());
    }

    showModal() {
        this.setState({
          opco: {
            code: "",
            name: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            localeId: "",
            regionId: "",
          },
          show: true
        });
      }
    
      hideModal() {
        this.setState({
          opco: {
            code: "",
            name: "",
            address: "",
            city: "",
            zip: "",
            country: "",
            localeId: "",
            regionId: "",
          },
          submitted: false,
          show: false
        });
      }

    handleChangeOpco(event) {
        const target = event.target;
        const { opco } = this.state
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            opco: {
                ...opco,
                [name]: value
            }
        });
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    filterName(opcos){
        const { code, name, city, country, region } = this.state
        if (opcos.items) {
          return arraySorted(opcos.items, 'name').filter(function (opco) {
            return (doesMatch(code, opco.code, 'String') 
            && doesMatch(name, opco.name, 'String') 
            && doesMatch(city, opco.city, 'String')
            && doesMatch(country, opco.country, 'String')
            && doesMatch(region, opco.region.name, 'String'));
          });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { opco } = this.state;
        const { dispatch } = this.props;
        if (
            opco.id &&
            opco.code &&
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ) {
            dispatch(opcoActions.update(opco));
            this.hideModal();
            // this.setState({ submitted: false });
        } else if (
            opco.code &&
            opco.name &&
            opco.address &&
            opco.city &&
            opco.country &&
            opco.localeId &&
            opco.regionId
        ){
            dispatch(opcoActions.create(opco));
            this.hideModal();
            // this.setState({ submitted: false });
        }
    }

    handleOnclick(event, id) {
        const { opcos } = this.props
        let user = JSON.parse(localStorage.getItem('user'));
        if (event.target.type != 'checkbox' && opcos.items && user.isSuperAdmin) {
          let found = opcos.items.find(element => element.id === id);
          this.setState({
            opco: {
              id: id,
              code: found.code,
              name: found.name,
              address: found.address,
              city: found.city,
              zip: found.zip,
              country: found.country,
              localeId: found.localeId,
              regionId: found.regionId,
            },
            show: true
          })
        }
      }

    handleDeletOpco(event, id) {
        event.preventDefault();
        const { dispatch } = this.props
        dispatch(opcoActions.delete(id));
        this.hideModal();
        this.setState({ submitted: false });
    }

    onKeyPress(event) {
        if (event.which === 13 /* prevent form submit on key Enter */) {
            event.preventDefault();
        }
    }

    render() {
        const { alert, opcoCreating, opcoUpdating, opcoDeleting, locales, regions, opcos } = this.props;
        const { opco, show, code, name, city, country, region, submitted } = this.state;
        return (
            <Layout alert={alert}>
                {alert.message && 
                    <div className={`alert ${alert.type}`}>{alert.message}
                        <button className="close" onClick={(event) => this.handleClearAlert(event)}>
                            <span aria-hidden="true"><FontAwesomeIcon icon="times"/></span>
                        </button>
                    </div>
                }
                <h2>Add operation company</h2>
                <hr />
                <div id="opco" className="full-height">
                    <div className="action-row row ml-1 mb-3 mr-1" style={{height: '34px'}}>
                        <div className="ml-auto pull-right">
                            <button
                                className="btn btn-leeuwen-blue btn-lg"
                                onClick={this.showModal}
                                style={{height: '34px'}}
                            >
                                <span><FontAwesomeIcon icon="plus" className="fa-lg mr-2"/>Create Opco</span>
                            </button>
                        </div>
                    </div>
                    <div className="" style={{height: 'calc(100% - 44px)'}}>
                        <div className="row ml-1 mr-1 full-height" style={{borderStyle: 'solid', borderWidth: '1px', borderColor: '#ddd'}}>
                            <div className="table-responsive custom-table-container" >
                                <table className="table table-hover table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <HeaderInput
                                                type="text"
                                                title="Code"
                                                name="code"
                                                value={code}
                                                onChange={this.handleChangeHeader}
                                                width="15%" 
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Name"
                                                name="name"
                                                value={name}
                                                onChange={this.handleChangeHeader}
                                                width="40%" 
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="City"
                                                name="city"
                                                value={city}
                                                onChange={this.handleChangeHeader}
                                                width="15%" 
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Country"
                                                name="country"
                                                value={country}
                                                onChange={this.handleChangeHeader}
                                                width="15%" 
                                            />
                                            <HeaderInput
                                                type="text"
                                                title="Region"
                                                name="region"
                                                value={region}
                                                onChange={this.handleChangeHeader}
                                                width="15%" 
                                            />
                                        </tr>
                                    </thead>
                                    <tbody className="full-height">
                                        {opcos.items && this.filterName(opcos).map((o) =>
                                            <tr key={o._id} style={{cursor: 'pointer'}} onClick={(event) => this.handleOnclick(event, o._id)}>
                                                <td>{o.code}</td>
                                                <td>{o.name}</td>
                                                <td>{o.city}</td>
                                                <td>{o.country}</td>
                                                <td>{o.region.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>


                        <Modal
                            show={show}
                            hideModal={this.hideModal}
                            title={opco.id ? 'Update Opco' : 'Create Opco'}
                            // size="modal-xl"
                        >
                            <div className="col-12">
                                <form
                                    name="form"
                                    onSubmit={this.handleSubmit}
                                    onKeyPress={this.onKeyPress}
                                >
                                    <Input
                                        title="Code"
                                        name="code"
                                        type="text"
                                        value={opco.code}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Name"
                                        name="name"
                                        type="text"
                                        value={opco.name}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Address"
                                        name="address"
                                        type="text"
                                        value={opco.address}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="City"
                                        name="city"
                                        type="text"
                                        value={opco.city}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Input
                                        title="Zip"
                                        name="zip"
                                        type="text"
                                        value={opco.zip}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={false}
                                    />
                                    <Input
                                        title="Country"
                                        name="country"
                                        type="text"
                                        value={opco.country}
                                        onChange={this.handleChangeOpco}
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Select
                                        title="Region"
                                        name="regionId"
                                        options={arraySorted(regions.items, 'name')}
                                        value={opco.regionId}
                                        onChange={this.handleChangeOpco}
                                        placeholder=""
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <Select
                                        title="Locale"
                                        name="localeId"
                                        options={arraySorted(locales.items, 'name')}
                                        value={opco.localeId}
                                        onChange={this.handleChangeOpco}
                                        placeholder=""
                                        submitted={submitted}
                                        inline={false}
                                        required={true}
                                    />
                                    <div className="modal-footer">
                                    {opco.id ?
                                        <div className="row">
                                            <div className="col-6">
                                                <button
                                                    // type="submit"
                                                    className="btn btn-leeuwen btn-lg"
                                                    onClick={(event) => {this.handleDeletOpco(event, opco.id)}}
                                                >
                                                    {opcoDeleting && (
                                                        <FontAwesomeIcon
                                                            icon="spinner"
                                                            className="fa-pulse fa-1x fa-fw" 
                                                        />
                                                    )}
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button
                                                    type="submit"
                                                    className="btn btn-leeuwen-blue btn-lg"
                                                >
                                                    {opcoUpdating && (
                                                        <FontAwesomeIcon
                                                            icon="spinner"
                                                            className="fa-pulse fa-1x fa-fw" 
                                                        />
                                                    )}
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    :
                                        <button
                                            type="submit"
                                            className="btn btn-leeuwen-blue btn-lg btn-full"
                                        >
                                            {opcoCreating && (
                                                <FontAwesomeIcon
                                                    icon="spinner"
                                                    className="fa-pulse fa-1x fa-fw" 
                                                />
                                            )}
                                            Create
                                        </button>
                                    }
                                    </div>
                                </form>
                            </div>
                        </Modal>
                    {/* </div> */}
                </div>
            </Layout>
        );
    }
}

function mapStateToProps(state) {
    const { opcos, alert, regions, locales } = state;
    const { opcoCreating, opcoUpdating, opcoDeleting } = state.opcos;
    return {
        alert,
        opcoCreating,
        opcoUpdating,
        opcoDeleting,
        regions,
        locales,
        opcos
    };
}

const connectedOpco = connect(mapStateToProps)(Opco);
export { connectedOpco as Opco };