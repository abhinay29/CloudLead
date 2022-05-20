// import React from "react";
// import TableRow from "./TableRow";

// function ShowContactModal() {
//   return (
//     <>
//       <div className="modal-dialog modal-fullscreen">
//         <div className="modal-content">
//           <div className="modal-header">
//             <p className="text-primary position-absolute">
//               Total Contacts: {totalContacts}
//             </p>
//             {/* <h5 className="modal-title w-100 text-center">{companyName}</h5> */}
//             <button
//               type="button"
//               className="btn-close"
//               onClick={() => closeModal("showContactModal")}
//               aria-label="Close"
//             ></button>
//           </div>
//           <div className="modal-body">
//             <div
//               className="table-responsive border"
//               style={{ height: "calc(100vh - 150px)", overflowY: "scroll" }}
//             >
//               <table
//                 className="table table-borderless tableFixHead mb-0"
//                 id="peopleTable"
//               >
//                 <thead>
//                   <tr>
//                     <th>
//                       <div className="d-flex align-items-center">
//                         <input
//                           type="checkbox"
//                           id="allSelector"
//                           onClick={(e) => {
//                             return false;
//                           }}
//                           className="form-check-input mt-0 me-3"
//                         />
//                         <span>Person's Name</span>
//                       </div>
//                     </th>
//                     {/* <th>Title</th> */}
//                     <th>Company</th>
//                     <th>Email</th>
//                     <th>Direct Dial</th>
//                     <th>Boardline Numbers</th>
//                     <th>Contact Location</th>
//                     <th>Company Location</th>
//                   </tr>
//                 </thead>
//                 <tbody id="contactTable">
//                   {peoples.length !== 0 && (
//                     <TableRow
//                       TableData={peoples}
//                       closeModal={closeModal}
//                       showCompanyInfo={getCompanyInfo}
//                       selectAll={false}
//                     />
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <div className="mt-3 d-flex align-items-end">
//               <nav className="ms-auto d-flex align-items-center">
//                 <Pagination
//                   activePage={pageContact}
//                   itemsCountPerPage={50}
//                   totalItemsCount={totalContacts}
//                   pageRangeDisplayed={7}
//                   onChange={handleContactPageChange}
//                   activeClass="active"
//                   itemClass="page-item"
//                   innerClass="pagination mb-0"
//                   linkClass="page-link"
//                   firstPageText="First"
//                   lastPageText="Last"
//                   prevPageText="Previous"
//                   nextPageText="Next"
//                   disabledClass="disabled"
//                   activeLinkClass="disabled"
//                 />
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ShowContactModal;
