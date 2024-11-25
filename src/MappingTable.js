import React from 'react';
import { useTable, useFilters } from 'react-table';

// MappingRow component
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

// MappingTable component with filters
const MappingTable = ({ mappings, validPayload2Fields, payload1, onMappingChange, onAddMapping, onAddValueMapping, onRemoveValueMapping, onRemoveMapping }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setFilter } = useTable(
        {
            columns: [
                {
                    Header: 'Payload 1 Field',
                    accessor: 'payload1Field',
                    Filter: ({ column }) => (
                        <input
                            type="text"
                            className="form-control"
                            value={column.filterValue || ''}
                            onChange={e => column.setFilter(e.target.value || undefined)}
                            placeholder="Search Payload 1"
                        />
                    )
                },
                {
                    Header: 'Payload 2 Field',
                    accessor: 'payload2Field',
                    Filter: ({ column }) => (
                        <input
                            type="text"
                            className="form-control"
                            value={column.filterValue || ''}
                            onChange={e => column.setFilter(e.target.value || undefined)}
                            placeholder="Search Payload 2"
                        />
                    )
                },
                {
                    Header: 'Type',
                    accessor: 'type',
                    Filter: ({ column }) => (
                        <input
                            type="text"
                            className="form-control"
                            value={column.filterValue || ''}
                            onChange={e => column.setFilter(e.target.value || undefined)}
                            placeholder="Search Type"
                        />
                    )
                },
                {
                    Header: 'Value Maps',
                    accessor: 'valueMaps',
                    Filter: () => null // No filtering for the "Value Maps" column
                }
            ],
            data: mappings
        },
        useFilters
    );

    return (
        <div className="container mt-5">
            <h1>JSON Mapping Tool</h1>

            <div className="sticky-wrapper">
                <div className="mb-3 sticky-top" style={{ zIndex: 1 }}>
                    <button className="btn btn-success" onClick={onAddMapping}>
                        Add Mapping
                    </button>
                </div>

                {/* Table with Filters Above Columns */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
                    <table {...getTableProps()} className="table table-bordered table-striped">
                        <thead className="sticky-top" style={{ backgroundColor: '#f8f9fa', zIndex: 2 }}>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                            <div>{column.canFilter ? column.render('Filter') : null}</div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <MappingRow
                                        key={row.index}
                                        index={row.index}
                                        mapping={row.original}
                                        validPayload2Fields={validPayload2Fields}
                                        payload1={payload1}
                                        onChange={onMappingChange}
                                        onAddValueMap={onAddValueMapping}
                                        onRemoveValueMap={onRemoveValueMapping}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MappingTable;
