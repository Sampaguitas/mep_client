import React from 'react';
import { connect } from 'react-redux';
import TableInput from '../../../../_components/table-input'
import _ from 'lodash';

function arraySorted(array, field, subfiled ) {
    if (array) {
        const newArray = array
        if (!subfiled) {
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
        } else {
            newArray.sort(function(a,b){
                if (a[field][subfiled] < b[field][subfiled]) {
                    return -1;
                }
                if (a[field][subfiled] > b[field][subfiled]) {
                    return 1;
                }
                return 0;
            });
            return newArray;
        }
    }
}

function doesMatch(search, array, type) {
    if (!search) {
        return true;
    } else if (!array && search) {
        return false;
    } else {
        switch(type) {
            case 'Id':
                return _.isEqual(search, array);
            case 'String':
                search = search.replace(/([()[{*+.$^\\|?])/g, "");
                return !!array.match(new RegExp(search, "i"));
            case 'Number':
                console.log('array:', typeof(String(array)));
                search = String(search).replace(/([()[{*+.$^\\|?])/g, "");
                return !!String(array).match(new RegExp(search, "i"));
                //return array == Number(search);
            case 'Boolean':
                if (Number(search) == 1) {
                    return true; //any
                } else if (Number(search) == 2) {
                    return !!array == 1; //true
                } else if (Number(search) == 3) {
                    return !!array == 0; //false
                }
            case 'Select':
                if(search == 'any' || _.isEqual(search, array)) {
                    return true; //any or equal
                } else {
                    return false;
                }
            default: return true;
        }
    }
}

class Screens extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            align: 'any',
            edit: 1,
            forSelect: '',
            forShow: '',
            screenId: '',
            fieldId: '',
            custom: '',
            selectedScreen:'5cd2b643fd333616dc360b66',
            loaded: false,
            show: false,
        }
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.filterName = this.filterName.bind(this);
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
    
    filterName(array){
        
        const { 
            align,
            edit,
            forSelect,
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
        } = this.state;

        if (array) {
          return arraySorted(array, 'fields', 'custom').filter(function (element) {
            return (doesMatch(selectedScreen, element.screenId, 'Id')
            && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
            && doesMatch(forSelect, element.forSelect, 'Number')
            && doesMatch(align, element.align, 'Select')
            // && doesMatch(edit, element.edit, 'Boolean')
            );
          });
        } else {
            return [];
        }
    }

    render() {
        const {
            selection, 
            tab,
            screens,
        } = this.props;
        
        const {
            align,
            edit,
            forSelect,
            forShow,
            screenId,
            fieldId,
            custom,
            selectedScreen,
        } = this.state;

        return (
            <div className="tab-pane fade show full-height" id={tab.id} role="tabpanel">
            <div className="row full-height">
                <div className="table-responsive full-height">
                    <table className="table table-hover table-sm table-bordered" >
                        <thead>
                            <tr className="text-center">
                                <th colSpan="5" >
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text">Select Screen</span>
                                        </div>
                                        <select className="form-control" name="selectedScreen" value={selectedScreen} onChange={this.handleChangeHeader}>
                                            {
                                                screens.items && arraySorted(screens.items, "name").map((screen) =>  {        
                                                    return (
                                                        <option 
                                                            key={screen._id}
                                                            value={screen._id}>{screen.name}
                                                        </option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th>Field<br/>
                                    <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                </th>
                                <th style={{width: '15%'}}>For Show<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forShow" value={forShow} onChange={this.handleChangeHeader} />
                                </th>
                                <th style={{width: '15%'}}>For Select<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forSelect" value={forSelect} onChange={this.handleChangeHeader} />
                                </th>
                                <th scope="col" style={{width: '15%'}}>Align<br />
                                    <select className="form-control" name="align" value={align} onChange={this.handleChangeHeader}>
                                        <option key="0" value="any">Any</option>
                                        <option key="1" value="left">Left</option>
                                        <option key="2" value="right">Right</option> 
                                        <option key="3" value="center">Center</option>                    
                                    </select>
                                </th>
                                <th scope="col" style={{width: '10%'}}>Disable<br />
                                    <select className="form-control" name="edit" value={edit} onChange={this.handleChangeHeader}>
                                        <option key="1" value="1">Any</option>
                                        <option key="2" value="2">True</option> 
                                        <option key="3" value="3">False</option>                    
                                    </select>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="full-height" style={{overflowY:'auto'}}>
                            {selection && selection.project && this.filterName(selection.project.fieldnames).map((s) =>
                                <tr key={s._id}>
                                    <td>{s.fields.custom}</td>
                                    <td>{s.forShow}</td>
                                    <td>{s.forSelect}</td>
                                    <td>{s.align}</td>
                                    <td>{s.edit}</td>
                                    {/* <TableInput 
                                        collection="field"
                                        objectId={s._id}
                                        fieldName="custom"
                                        fieldValue={s.custom}
                                        fieldType="text"
                                    /> */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
        );
    }
}

export default Screens;