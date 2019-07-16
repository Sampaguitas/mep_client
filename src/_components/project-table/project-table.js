import React, { Component } from 'react';
import HeaderCheckBox from '../../_components/project-table/header-check-box';
import HeaderInput from '../../_components/project-table/header-input';
import HeaderSelect from '../../_components/project-table/header-select';
import NewRowCreate from '../../_components/project-table/new-row-create';
import NewRowCheckBox from '../../_components/project-table/new-row-check-box';
import NewRowInput from '../../_components/project-table/new-row-input';
import NewRowSelect from '../../_components/project-table/new-row-select';
import TableInput from '../../_components/project-table/table-input';
import TableSelect from '../../_components/project-table/table-select';
import TableCheckBox from '../../_components/project-table/table-check-box';
import TableSelectionRow from '../../_components/project-table/table-selection-row';
import TableSelectionAllRow from '../../_components/project-table/table-selection-all-row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
 }

function resolve(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : null
    }, obj || self)
}

function arraySorted(array, field) {
    if (array) {
        const newArray = array
        newArray.sort(function(a,b){
            if (resolve(field, a) < resolve(field, b)) {
                return -1;
            } else if ((resolve(field, a) > resolve(field, b))) {
                return 1;
            } else {
                return 0;
            }
        });
        return newArray;             
    }
}

function returnScreenHeaders(selection, screenId) {
    if (selection.project) {
        return selection.project.fieldnames.filter(function(element) {
            return (_.isEqual(element.screenId, screenId) && !!element.forShow); 
        });
    } else {
        return [];
    }
}

class ProjectTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: {},
            selectedRows: [],
            selectAllRows: false,
        };
        this.onFocusRow = this.onFocusRow.bind(this);
        this.onBlurRow = this.onBlurRow.bind(this);
        this.handleChangeHeader = this.handleChangeHeader.bind(this);
        this.toggleSelectAllRow = this.toggleSelectAllRow.bind(this);
        this.filterName = this.filterName.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
    }

    handleChangeHeader(event) {
        const target = event.target;
        const name = target.name;
        const { header } = this.state;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            ...this.state,
            header:{
                ...header,
                [name]: value
            } 
        });
    }

    onFocusRow(event) {
        // event.preventDefault();
        // const { selectedTemplate, newRowFocus } = this.state;
        // if (selectedTemplate !='0' && event.currentTarget.dataset['type'] == undefined && newRowFocus == true){
        //     this.cerateNewRow(event);
        // }
    }

    onBlurRow(event){
        // event.preventDefault()
        // if (event.currentTarget.dataset['type'] == 'newrow'){
        //     this.setState({
        //         ...this.state,
        //         newRowFocus: true
        //     });
        // }
    }

    toggleSelectAllRow() {
        // const { selectAllRows } = this.state;
        // const { selection } = this.props;
        // if (selection.project) {
        //     if (selectAllRows) {
        //         this.setState({
        //             ...this.state,
        //             selectedRows: [],
        //             selectAllRows: false
        //         });
        //     } else {
        //         this.setState({
        //             ...this.state,
        //             selectedRows: this.filterName(selection.project.docfields).map(s => s._id),
        //             selectAllRows: true
        //         });
        //     }         
        // }
    }

    filterName(array){
        
        // const {
        //     header
        // } = this.state;

        // if (array) {
        //   return arraySorted(array, 'fields.custom').filter(function (element) {
        //     return (doesMatch(selectedTemplate, element.docdefId, 'Id')
        //     && doesMatch(worksheet, element.worksheet, 'Select')
        //     && doesMatch(location, element.location, 'Select')
        //     && doesMatch(row, element.row, 'Number')
        //     && doesMatch(col, element.col, 'Number')
        //     && element.fields && doesMatch(custom, element.fields.custom, 'String')
        //     );
        //   });
        // } else {
        //     return [];
        // }
    }

    updateSelectedRows(id) {
        const { selectedRows } = this.state;
        if (selectedRows.includes(id)) {
            this.setState({
                ...this.state,
                selectedRows: arrayRemove(selectedRows, id)
            });
        } else {
            this.setState({
                ...this.state,
                selectedRows: [...selectedRows, id]
            });
        }       
    }
    
    render() {
        const { handleSelectionReload, screenHeaders, screenBodys } = this.props;
        const { header,selectAllRows  } = this.state;
        return (
            <div className="full-height">
                <div className="btn-group-vertical pull-right">
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '50px', height: '50px'}}> 
                        <span><FontAwesomeIcon icon="cog" className="fas fa-3x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue"style={{width: '50px', height: '50px'}}>
                        <span><FontAwesomeIcon icon="filter" className="far fa-3x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" onClick={event => handleSelectionReload(event)} style={{width: '50px', height: '50px'}}>
                        <span><FontAwesomeIcon icon="sync-alt" className="far fa-3x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '50px', height: '50px'}}>
                        <span><FontAwesomeIcon icon="unlock" className="fas fa-3x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '50px', height: '50px'}}>
                        <span><FontAwesomeIcon icon="download" className="fas fa-3x"/></span>
                    </button>
                    <button className="btn btn-outline-leeuwen-blue" style={{width: '50px', height: '50px'}}>
                        <span><FontAwesomeIcon icon="upload" className="fas fa-3x"/></span>
                    </button>
                </div>
                <div className="row ml-1 full-height">
                    <div className="table-responsive full-height" > 
                        <table className="table table-hover table-bordered table-sm">
                            <thead>                                   
                                {screenHeaders && (
                                    <tr>
                                        <TableSelectionAllRow
                                            checked={selectAllRows}
                                            onChange={this.toggleSelectAllRow}
                                        />
                                        {screenHeaders.map(screenHeader => {
                                            switch (screenHeader.fields.type) {
                                                case "String":
                                                    return ( 
                                                        <HeaderInput
                                                            type="text"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );
                                                case "Number":
                                                    return ( 
                                                        <HeaderInput
                                                            type="number"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );
                                                default: 
                                                    return ( 
                                                        <HeaderInput
                                                            type="text"
                                                            title={screenHeader.fields.custom}
                                                            name={screenHeader._id}
                                                            value={header[screenHeader._id]}
                                                            onChange={this.handleChangeHeader}
                                                            key={screenHeader._id}
                                                            textNoWrap={true}
                                                        />
                                                    );                                                                                                  
                                            }
                                        })}
                                    </tr>
                                )}
                            </thead>                                
                            <tbody className="full-height">
                                {screenBodys && screenBodys.map(screenBody => {
                                    return (
                                        <tr key={screenBody._id} onBlur={this.onBlurRow} onFocus={this.onFocusRow} style={{height: '40px', lineHeight: '17.8571px'}}>
                                            <TableSelectionRow
                                                id={screenBody._id}
                                                selectAllRows={this.state.selectAllRows}
                                                callback={this.updateSelectedRows}
                                            />
                                            {screenHeaders.map(screenHeader => {
                                                return (<td>{screenHeader.fields.name}</td>)
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        );
    }
}

export default ProjectTable;