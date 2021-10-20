import React from 'react'

function NoRecordFound() {
  return (
    <>
      <tr>
        <td colSpan="11">
          <div className="d-flex align-items-center justify-content-center p-5 flex-column" style={{ "height": "calc(100vh - 320px)", "width": "100%" }}>
            <img src="/assets/images/blank.svg" alt="" style={{ "objectFit": "contain", "height": "90%" }} />
            <h4 className="text-primary mt-4 mb-0">No record found</h4>
          </div>
        </td>
      </tr>
    </>
  )
}

export default NoRecordFound
