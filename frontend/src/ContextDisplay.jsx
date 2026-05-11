/** @format */

// /** @format */

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ContextDisplay() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/context").then((res) => setData(res.data));
//   }, []);

//   return (
//     <div className="container mt-5 text-center">
//       <h2 className="main-heading">Context</h2>

//       {data.map((item, index) => (
//         <div key={index} className="card context-card shadow p-4 mt-4">
//           <h4 className="fw-bold text-primary">{item.name}</h4>

//           <p className="mt-3 text-muted">{item.context}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ContextDisplay;
