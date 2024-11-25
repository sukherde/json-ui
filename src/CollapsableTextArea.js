import React, { useState } from 'react';

const CollapsibleTextarea = ({ payload1Input, handlePayload1Change }) => {
    // State to manage the visibility of the collapsible section
    const [isCollapsed, setIsCollapsed] = useState(true);

    // Toggle the collapsible state
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="mb-3">
            {/* Button to toggle collapse */}
            <button
                className="btn btn-info mb-2"
                onClick={toggleCollapse}
                aria-expanded={!isCollapsed}
            >
                {isCollapsed ? 'Show payload' : 'Hide payload'}
            </button>

            {/* Collapsible container */}
            <div
                style={{
                    maxHeight: isCollapsed ? '0' : '300px', // Control the height based on collapsed state
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-out', // Smooth transition
                }}
            >
                <textarea
                    className="form-control"
                    rows="10"
                    value={payload1Input}
                    onChange={handlePayload1Change}
                />
            </div>
        </div>
    );
};

export default CollapsibleTextarea;
