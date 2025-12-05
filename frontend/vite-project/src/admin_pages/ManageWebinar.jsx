import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'; // adjust if needed

// shared input styling (blue border + focus ring)
const inputClass = `
  w-full border border-blue-300 rounded px-3 py-2 mb-4
  focus:outline-none focus:ring-2 focus:ring-blue-400
`;

export default function ManageWebinar() {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editWebinar, setEditWebinar] = useState(null);
  const [formData, setFormData] = useState({
    title: "", beginning_date: "", end_date: "", venue: "",
    mode: "Online", expert: "", expert_experience: "",
    duration: "", price: "", description: "",
    part1: "", part2: "", part3: "",
    specialref: "", discount: 0,
  });
  const [secretKey, setSecretKey] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [expertImageFile, setExpertImageFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/webinar`);
        setWebinars(Array.isArray(res.data) ? res.data : []);
      } catch {
        setWebinars([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEditClick = (w) => {
    setEditWebinar(w);
    setSecretKey("");
    setErrorMsg("");
    setFormData({
      title: w.title || "",
      beginning_date: w.beginning_date?.slice(0, 10) || "",
      end_date: w.end_date?.slice(0, 10) || "",
      venue: w.venue || "",
      mode: w.mode || "Online",
      expert: w.expert || "",
      expert_experience: w.expert_experience || "",
      duration: w.duration || "",
      price: w.price || 0,
      description: w.description || "",
      part1: w.part1 || "",
      part2: w.part2 || "",
      part3: w.part3 || "",
      specialref: w.specialref || "",
      discount: w.discount || 0,
    });
    setImageFile(null);
    setExpertImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSecretKeyChange = e => setSecretKey(e.target.value);
  const handleFileChange = e => {
    const { name, files } = e.target;
    if (name === "image") setImageFile(files[0]);
    if (name === "expert_image") setExpertImageFile(files[0]);
  };

  const fadeError = () => setTimeout(() => setErrorMsg(""), 3000);

  const handleUpdate = async e => {
    e.preventDefault();
    setErrorMsg("");
    if (!secretKey) {
      setErrorMsg("Secret key is required");
      return fadeError();
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    if (imageFile) payload.append("image", imageFile);
    if (expertImageFile) payload.append("expert_image", expertImageFile);
    payload.append("secret_key", secretKey);

    try {
      await axios.put(
        `${BASE_URL}/editwebinar/${editWebinar._id}`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      // refresh list
      setEditWebinar(null);
      setLoading(true);
      const fresh = await axios.get(`${BASE_URL}/webinar`);
      setWebinars(Array.isArray(fresh.data) ? fresh.data : []);
    } catch (err) {
      setErrorMsg(err.response?.status === 401
        ? "Secret key is wrong"
        : "Failed to update webinar"
      );
      fadeError();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    const key = window.prompt("Enter secret key to delete:");
    if (!key) return;
    try {
      await axios.delete(`${BASE_URL}/deletewebinar/${id}`, {
        data: { secret_key: key }
      });
      setWebinars(prev => prev.filter(w => w._id !== id));
    } catch {
      alert("Deletion failed. Check your key.");
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/download-user-event-excel`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "eventwise_users.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download Excel file.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-center text-blue-700 text-lg">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">
              Manage Webinars
            </h1>
            <p className="mt-1 text-sm text-blue-600">
              View, edit, or remove webinars and export registrations.
            </p>
          </div>

          <button
            onClick={downloadExcel}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition"
          >
            Download Excel
          </button>
        </div>

        {/* Webinars list */}
        {webinars.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-xl p-8 text-center shadow-sm">
            <p className="text-blue-700 font-medium">
              No webinars available.
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Once you add webinars, they will appear here for management.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {webinars.map(w => (
              <div
                key={w._id}
                className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-1 text-left">
                  <h2 className="text-lg font-semibold text-blue-900 line-clamp-2">
                    {w.title}
                  </h2>
                  <p className="text-xs text-blue-500 uppercase tracking-wide">
                    {w.mode} • {w.venue || "Venue TBA"}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Expert: <span className="font-medium">{w.expert}</span>
                  </p>
                  <p className="text-sm text-blue-700">
                    Price: <span className="font-semibold">₹{w.price}</span>
                  </p>
                  {w.beginning_date && w.end_date && (
                    <p className="text-xs text-blue-500 mt-1">
                      {w.beginning_date.slice(0, 10)} – {w.end_date.slice(0, 10)}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditClick(w)}
                    className="flex-1 min-w-[90px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="flex-1 min-w-[90px] bg-white border border-red-300 text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit form */}
        {editWebinar && (
          <div className="mt-10">
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 sm:p-8">
              <div className="mb-6 border-b border-blue-100 pb-4">
                <h2 className="text-2xl font-bold text-blue-900">
                  Edit webinar
                </h2>
                <p className="text-sm text-blue-500 mt-1">
                  Updating: <span className="font-medium">{editWebinar.title}</span>
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* grid layout for fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    ["title", "Title", "text"],
                    ["beginning_date", "Beginning Date", "date"],
                    ["end_date", "End Date", "date"],
                    ["venue", "Venue", "text"],
                    ["expert", "Expert Name", "text"],
                    ["expert_experience", "Expert Experience", "text"],
                    ["duration", "Duration", "text"],
                    ["price", "Price (₹)", "number"],
                    ["specialref", "Special Ref Code", "text"],
                    ["discount", "Discount (%)", "number"],
                  ].map(([name, label, type]) => (
                    <div key={name}>
                      <label className="block mb-1 text-sm font-medium text-blue-800">
                        {label}
                      </label>
                      <input
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {/* Mode */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-blue-800">
                      Mode
                    </label>
                    <select
                      name="mode"
                      value={formData.mode}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option>Online</option>
                      <option>Offline</option>
                      <option>Hybrid</option>
                    </select>
                  </div>

                  {/* Description (full width on md by col-span-2) */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-blue-800">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={inputClass + " h-28"}
                    />
                  </div>

                  {/* Parts */}
                  {["part1", "part2", "part3"].map(p => (
                    <div key={p} className="md:col-span-1">
                      <label className="block mb-1 text-sm font-medium text-blue-800">
                        {p.replace("part", "Part ")}
                      </label>
                      <input
                        name={p}
                        type="text"
                        value={formData[p]}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  ))}

                  {/* File uploads (full width) */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-blue-800">
                      Webinar Image
                    </label>
                    <input
                      name="image"
                      type="file"
                      onChange={handleFileChange}
                      className="block mb-4 text-sm"
                    />
                    <label className="block mb-2 text-sm font-medium text-blue-800">
                      Expert Image
                    </label>
                    <input
                      name="expert_image"
                      type="file"
                      onChange={handleFileChange}
                      className="block text-sm"
                    />
                  </div>

                  {/* Secret key (full width) */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-blue-800">
                      Secret Key
                    </label>
                    <input
                      type="password"
                      value={secretKey}
                      onChange={handleSecretKeyChange}
                      className={inputClass}
                      placeholder="Enter secret key"
                    />
                  </div>
                </div>

                {/* Buttons + error */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-blue-100">
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium shadow-sm transition"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditWebinar(null)}
                      className="bg-white border border-blue-300 text-blue-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition"
                    >
                      Cancel
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="px-3 py-2 bg-red-50 border border-red-300 text-red-700 rounded text-sm">
                      {errorMsg}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const BASE_URL = "http://localhost:3000"; // adjust if needed

// // shared input styling (blue border + focus ring)
// const inputClass = `
//   w-full border border-blue-300 rounded px-3 py-2 mb-4
//   focus:outline-none focus:ring-2 focus:ring-blue-400
// `;

// export default function ManageWebinar() {
//   const [webinars, setWebinars] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editWebinar, setEditWebinar] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "", beginning_date: "", end_date: "", venue: "",
//     mode: "Online", expert: "", expert_experience: "",
//     duration: "", price: "", description: "",
//     part1: "", part2: "", part3: "",
//     specialref: "", discount: 0,
//   });
//   const [secretKey, setSecretKey] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [expertImageFile, setExpertImageFile] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await axios.get(`${BASE_URL}/webinar`);
//         setWebinars(Array.isArray(res.data) ? res.data : []);
//       } catch {
//         setWebinars([]);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   const handleEditClick = (w) => {
//     setEditWebinar(w);
//     setSecretKey("");
//     setErrorMsg("");
//     setFormData({
//       title: w.title || "",
//       beginning_date: w.beginning_date?.slice(0, 10) || "",
//       end_date: w.end_date?.slice(0, 10) || "",
//       venue: w.venue || "",
//       mode: w.mode || "Online",
//       expert: w.expert || "",
//       expert_experience: w.expert_experience || "",
//       duration: w.duration || "",
//       price: w.price || 0,
//       description: w.description || "",
//       part1: w.part1 || "",
//       part2: w.part2 || "",
//       part3: w.part3 || "",
//       specialref: w.specialref || "",
//       discount: w.discount || 0,
//     });
//     setImageFile(null);
//     setExpertImageFile(null);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
//   const handleSecretKeyChange = e => setSecretKey(e.target.value);
//   const handleFileChange = e => {
//     const { name, files } = e.target;
//     if (name === "image") setImageFile(files[0]);
//     if (name === "expert_image") setExpertImageFile(files[0]);
//   };

//   const fadeError = () => setTimeout(() => setErrorMsg(""), 3000);

//   const handleUpdate = async e => {
//     e.preventDefault();
//     setErrorMsg("");
//     if (!secretKey) {
//       setErrorMsg("Secret key is required");
//       return fadeError();
//     }

//     const payload = new FormData();
//     Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
//     if (imageFile) payload.append("image", imageFile);
//     if (expertImageFile) payload.append("expert_image", expertImageFile);
//     payload.append("secret_key", secretKey);

//     try {
//       await axios.put(
//         `${BASE_URL}/editwebinar/${editWebinar._id}`,
//         payload,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );
//       // refresh list
//       setEditWebinar(null);
//       setLoading(true);
//       const fresh = await axios.get(`${BASE_URL}/webinar`);
//       setWebinars(Array.isArray(fresh.data) ? fresh.data : []);
//     } catch (err) {
//       setErrorMsg(err.response?.status === 401
//         ? "Secret key is wrong"
//         : "Failed to update webinar"
//       );
//       fadeError();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async id => {
//     const key = window.prompt("Enter secret key to delete:");
//     if (!key) return;
//     try {
//       await axios.delete(`${BASE_URL}/deletewebinar/${id}`, {
//         data: { secret_key: key }
//       });
//       setWebinars(prev => prev.filter(w => w._id !== id));
//     } catch {
//       alert("Deletion failed. Check your key.");
//     }
//   };




//   const downloadExcel = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/download-user-event-excel`, {
//         responseType: "blob", // Important for downloading files
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "eventwise_users.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Download error:", error);
//       alert("Failed to download Excel file.");
//     }
//   };





//   if (loading) return <p className="p-4 text-center text-blue-700">Loading…</p>;

//   return (
// <div className=" text-center max-w-3xl mx-auto px-4">
//     <div className="  bg-blue-50 min-h-screen py-8">
//       {/* <button
//         onClick={downloadExcel}
//         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md mb-4"
//       >
//         Download Excel
//       </button> */}


//       {/* <div className="max-w-3xl mx-auto px-4"> */}
//         <h1 className="text-4xl font-bold text-blue-800 mb-6">Manage Webinars</h1>
//         <button
//         onClick={downloadExcel}
//         className="bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded-md mb-4"
//       >
//         Download Excel
//       </button>

//         {webinars.length === 0 ? (
//           <p className=" text-blue-600">No webinars available. </p>
//         ) : (
//           webinars.map(w => (
//             <div
//               key={w._id}
//               className="bg-white border border-blue-200 rounded-lg p-5 mb-5 shadow-sm hover:shadow-md transition"
//             >
//               <h2 className="text-2xl font-semibold text-blue-800">{w.title}</h2>
//               <p className="text-sm text-blue-600">Mode: {w.mode}</p>
//               <p className="text-sm text-blue-600">Expert: {w.expert}</p>
//               <p className="text-sm text-blue-600">Price: ₹{w.price}</p>
//               <div className="mt-4 space-x-2">
//                 <button
//                   onClick={() => handleEditClick(w)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(w._id)}
//                   className="bg-white border border-red-400 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         )}

//         {editWebinar && (
//           <form
//             onSubmit={handleUpdate}
//             className="bg-white p-6 rounded-lg shadow-md mt-8"
//           >
//             <h2 className="text-2xl font-bold text-blue-800 mb-4">
//               Edit: {editWebinar.title}
//             </h2>


//             {/* Fields */}
//             {[
//               ["title", "Title", "text"],
//               ["beginning_date", "Beginning Date", "date"],
//               ["end_date", "End Date", "date"],
//               ["venue", "Venue", "text"],
//               ["expert", "Expert Name", "text"],
//               ["expert_experience", "Expert Experience", "text"],
//               ["duration", "Duration", "text"],
//               ["price", "Price (₹)", "number"],
//               ["specialref", "Special Ref Code", "text"],
//               ["discount", "Discount (%)", "number"],
//             ].map(([name, label, type]) => (
//               <div key={name}>
//                 <label className="block mb-1 text-blue-700 font-medium">
//                   {label}
//                 </label>
//                 <input
//                   name={name}
//                   type={type}
//                   value={formData[name]}
//                   onChange={handleChange}
//                   className={inputClass}
//                 />
//               </div>
//             ))}

//             {/* Description */}
//             <div>
//               <label className="block mb-1 text-blue-700 font-medium">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className={inputClass + " h-24"}
//               />
//             </div>

//             {/* Parts */}
//             {["part1", "part2", "part3"].map(p => (
//               <div key={p}>
//                 <label className="block mb-1 text-blue-700 font-medium">
//                   {p.replace("part", "Part ")}
//                 </label>
//                 <input
//                   name={p}
//                   type="text"
//                   value={formData[p]}
//                   onChange={handleChange}
//                   className={inputClass}
//                 />
//               </div>
//             ))}

//             {/* Mode */}
//             <div>
//               <label className="block mb-1 text-blue-700 font-medium">
//                 Mode
//               </label>
//               <select
//                 name="mode"
//                 value={formData.mode}
//                 onChange={handleChange}
//                 className={inputClass}
//               >
//                 <option>Online</option>
//                 <option>Offline</option>
//                 <option>Hybrid</option>
//               </select>
//             </div>

//             {/* File uploads */}
//             <div className="mb-4">
//               <label className="block mb-1 text-blue-700 font-medium">
//                 Webinar Image
//               </label>
//               <input
//                 name="image"
//                 type="file"
//                 onChange={handleFileChange}
//                 className="block mb-4"
//               />
//               <label className="block mb-1 text-blue-700 font-medium">
//                 Expert Image
//               </label>
//               <input
//                 name="expert_image"
//                 type="file"
//                 onChange={handleFileChange}
//                 className="block"
//               />
//             </div>

//             {/* Secret key */}
//             <div>
//               <label className="block mb-1 text-blue-700 font-medium">
//                 Secret Key
//               </label>
//               <input
//                 type="password"
//                 value={secretKey}
//                 onChange={handleSecretKeyChange}
//                 className={inputClass}
//                 placeholder="Enter secret key"
//               />
//             </div>

//             {/* Buttons */}
//             <div className="flex space-x-4">
//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
//               >
//                 Update
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setEditWebinar(null)}
//                 className="bg-white border border-blue-300 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
//               >
//                 Cancel
//               </button>
//             </div>

//             {/* Error */}
//             {errorMsg && (
//               <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//                 {errorMsg}
//               </div>
//             )}
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
