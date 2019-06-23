import React from 'react';
import { connect } from 'react-redux';

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

class Duf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forSelect: '',
            screenId: '',
            fieldId: '',
            custom: '',
            selectedScreen:'5cd2b646fd333616dc360b6d',
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
            forShow,
            custom,
            selectedScreen,
        } = this.state;

        if (array) {
          return arraySorted(array, 'fields', 'custom').filter(function (element) {
            return (doesMatch(selectedScreen, element.screenId, 'Id')
            && doesMatch(custom, element.fields.custom, 'String')
            && doesMatch(forShow, element.forShow, 'Number')
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
        } = this.props;
        
        const {
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
                            <tr>
                                <th style={{width: '15%'}}>Column<br/>
                                    <input type="number" min="0" step="1" className="form-control" name="forShow" value={forShow} onChange={this.handleChangeHeader} />
                                </th>
                                <th>Field<br/>
                                    <input className="form-control" name="custom" value={custom} onChange={this.handleChangeHeader} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="full-height" style={{overflowY:'auto'}}>
                            {selection && selection.project && this.filterName(selection.project.fieldnames).map((s) =>
                                <tr key={s._id}>
                                    <td>{s.forShow}</td>
                                    <td>{s.fields.custom}</td>
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

export default Duf;