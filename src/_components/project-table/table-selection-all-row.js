import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './table-selection-all-row.css'

class TableSelectionAllRow extends Component {
    render(){
        const { checked, onChange } = this.props
        return (
            <th style={{ width: '30px', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                    <label className="fancy-table-selection-all-row">
                    <input type="checkbox" name="fieldValue" checked={checked} onChange={onChange}/>
                        <FontAwesomeIcon icon="check" className="checked fa-lg" style={{color: '#0070C0', padding: 'auto', textAlign: 'center', width: '100%'}}/> 
                        <FontAwesomeIcon icon="check" className="unchecked fa-lg" style={{color: '#adb5bd', padding: 'auto', textAlign: 'center', width: '100%'}}/> {/*#ededed*/}
                    </label>

                </div>
            </th>
        );
    }
};

export default TableSelectionAllRow;
