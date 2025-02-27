import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTable, useFilters } from 'react-table';

// Sample data for Payload 1 and Payload 2
const initialPayload1 = {
    request: {
        body: {
            details: {
                name: "John Doe",
                age: 30,
                gender: "Male"
            }
        }
    }
};

const initialPayload2 = {
    client: {
        name: "",
        age: "",
        gender: ""
    }
};

const validPayload2Fields = {
    name: ["client.name", "client.fullName"],
    age: ["client.age", "client.yearsOld"],
    gender: ["client.gender", "client.sex"]
};

// Component for a single row in the mapping table
const MappingRow = ({ index, mapping, validPayload2Fields, payload1, onChange, onAddValueMap, onRemoveValueMap }) => {
    const payload1Fields = Object.keys(payload1.request.body.details);

    return (
        <tr>
            {/* Payload 1 Field */}
            <td>
                <select
                    className="form-select"
                    onChange={(e) => onChange(index, 'payload1Field', e.target.value)}
                    value={mapping.payload1Field}
                >
                    {payload1Fields.map((key) => (
                        <option key={key} value={`request.body.details.${key}`}>
                            {`payload1: request.body.details.${key}`}
                        </option>
                    ))}
                </select>
            </td>

            {/* Payload 2 Field */}
            <td>
                <select
                    className="form-select"
                    onChange={(e) => onChange(index, 'payload2Field', e.target.value)}
                    value={mapping.payload2Field}
                >
                    {validPayload2Fields[mapping.payload1Field]?.map((field, idx) => (
                        <option key={idx} value={field}>
                            {`payload2: ${field}`}
                        </option>
                    ))}
                </select>
            </td>

            {/* Type Field */}
            <td>
                <select
                    className="form-select"
                    onChange={(e) => onChange(index, 'type', e.target.value)}
                    value={mapping.type}
                >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                </select>
            </td>

            {/* Value Maps */}
            <td>
                {mapping.valueMaps.map((valueMap, valueMapIndex) => (
                    <div key={valueMapIndex} className="input-group mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Enter value for ${mapping.payload2Field}`}
                            value={valueMap}
                            onChange={(e) => onChange(index, 'valueMap', e.target.value, valueMapIndex)}
                        />
                        <button
                            className="btn btn-danger"
                            onClick={() => onRemoveValueMap(index, valueMapIndex)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onAddValueMap(index)}
                >
                    Add Value Map
                </button>
            </td>
        </tr>
    );
};

// Component to render the entire table
const MappingTable = ({ mappings, validPayload2Fields, payload1, onMappingChange, onAddMapping, onAddValueMapping, onRemoveValueMapping, onRemoveMapping }) => {
    return (
        <div className="container mt-5">
            <h1>JSON Mapping Tool</h1>

            {/* Sticky Wrapper for Add Mapping button and Table */}
            <div className="sticky-wrapper">
                {/* Sticky Add Mapping Button */}
                <div className="mb-3 sticky-top" style={{ zIndex: 1 }}>
                    <button className="btn btn-success" onClick={onAddMapping}>
                        Add Mapping
                    </button>
                </div>

                {/* Scrollable Table Container */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
                    {/* Table with Sticky Header */}
                    <table className="table table-bordered table-striped">
                        <thead className="sticky-top" style={{ backgroundColor: '#f8f9fa', zIndex: 2 }}>
                            <tr>
                                <th style={{ width: "25%" }}>Payload 1 Field</th>
                                <th style={{ width: "25%" }}>Payload 2 Field</th>
                                <th style={{ width: "15%" }}>Type</th>
                                <th style={{ width: "35%" }}>Value Maps</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappings.map((mapping, index) => (
                                <MappingRow
                                    key={index}
                                    index={index}
                                    mapping={mapping}
                                    validPayload2Fields={validPayload2Fields}
                                    payload1={payload1}
                                    onChange={onMappingChange}
                                    onAddValueMap={onAddValueMapping}
                                    onRemoveValueMap={onRemoveValueMapping}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

// Main App Component
const App = () => {
    const [payload1, setPayload1] = useState(initialPayload1);
    const [payload2, setPayload2] = useState(initialPayload2);
    const [mappings, setMappings] = useState([]);
    const [payload1Input, setPayload1Input] = useState(JSON.stringify(initialPayload1, null, 2));
    const [activeTab, setActiveTab] = useState('create');

    // Handler for changes in Payload 1 JSON
    const handlePayload1Change = (e) => {
        try {
            const newPayload1 = JSON.parse(e.target.value);
            setPayload1(newPayload1);
            setPayload1Input(e.target.value);
        } catch (error) {
            // Handle invalid JSON input
            console.error("Invalid JSON format", error);
        }
    };

    // Handler for changes in the mapping fields
    const handleMappingChange = (index, field, value, valueMapIndex = null) => {
        const newMappings = [...mappings];
        if (valueMapIndex !== null) {
            newMappings[index].valueMaps[valueMapIndex] = value;
        } else {
            newMappings[index][field] = value;
        }
        setMappings(newMappings);
    };

    // Add new mapping
    const handleAddMapping = () => {
        setMappings([
            ...mappings,
            {
                payload1Field: '',
                payload2Field: '',
                type: 'string', // default type
                valueMaps: ['']
            }
        ]);
    };

    // Remove mapping
    const handleRemoveMapping = (index) => {
        const newMappings = mappings.filter((_, i) => i !== index);
        setMappings(newMappings);
    };

    // Add new value map to an existing mapping
    const handleAddValueMap = (index) => {
        const newMappings = [...mappings];
        newMappings[index].valueMaps.push('');
        setMappings(newMappings);
    };

    // Remove value map
    const handleRemoveValueMap = (index, valueMapIndex) => {
        const newMappings = [...mappings];
        newMappings[index].valueMaps.splice(valueMapIndex, 1);
        setMappings(newMappings);
    };

    // Handle final submission
    const handleSubmit = () => {
        const updatedPayload2 = { ...payload2 };
        mappings.forEach(mapping => {
            const payload1Value = getNestedValue(payload1, mapping.payload1Field);
            mapping.valueMaps.forEach(valueMap => {
                if (valueMap) {
                    setNestedValue(updatedPayload2, mapping.payload2Field, valueMap || payload1Value);
                }
            });
        });
        setPayload2(updatedPayload2);
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const setNestedValue = (obj, path, value) => {
        const parts = path.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    };

    // Import Mapping
    const handleImportMapping = () => {
        try {
            const importedMappings = JSON.parse(payload1Input);
            setMappings(importedMappings);
        } catch (error) {
            console.error("Invalid mapping JSON format", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>JSON Mapping Tool</h1>

            {/* Tabs */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create Mapping from Input JSON
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'import' ? 'active' : ''}`}
                        onClick={() => setActiveTab('import')}
                    >
                        Import Mapping from JSON
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content m-3">
                {/* First Tab: Create Mapping */}
                {activeTab === 'create' && (
                    <div className="tab-pane fade show active">
                        {/* Payload 1 (Editable JSON) */}
                        <div>
                            <h2>Create Mapping from Input JSON</h2>
                            <textarea
                                className="form-control"
                                rows="10"
                                value={payload1Input}
                                onChange={handlePayload1Change}
                            />
                        </div>
                    </div>
                )}

                {/* Second Tab: Import Mapping */}
                {activeTab === 'import' && (
                    <div className="tab-pane fade">
                        <h2>Import Mapping from JSON</h2>
                        <button className="btn btn-success m-2" onClick={handleImportMapping}>
                            Import Mapping
                        </button>

                        <textarea
                            className="form-control"
                            rows="10"
                            value={payload1Input}
                            onChange={(e) => setPayload1Input(e.target.value)}
                            placeholder="Paste your JSON mappings here"
                        />
                    </div>
                )}

                <MappingTable
                    mappings={mappings}
                    validPayload2Fields={validPayload2Fields}
                    payload1={payload1}
                    onMappingChange={handleMappingChange}
                    onAddMapping={handleAddMapping}
                    onAddValueMapping={handleAddValueMap}
                    onRemoveValueMapping={handleRemoveValueMap}
                    onRemoveMapping={handleRemoveMapping}
                />

                <button className="btn btn-primary mb-3 mt-3" onClick={handleSubmit}>
                    Submit Mapping
                </button>
            </div>
        </div>
    );
};

export default App;
