import React from 'react'
import './Skeleton.css'

function TableRow() {
  return (
    <tr>
      <td className="px-4" colSpan="4">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </td>
      <td className="px-4" colSpan="4">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </td>
      <td className="px-4" colSpan="3">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </td>
    </tr>
  )
}

function TableSkeleton() {

  return (
    <>
      <TableRow />
      <TableRow />
      <TableRow />
      <TableRow />
      <TableRow />
    </>
  )
}

export default TableSkeleton
