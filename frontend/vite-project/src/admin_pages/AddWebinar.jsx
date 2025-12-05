import React, { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Shared input styling for blue theme
const inputClass = `
  w-full border border-blue-300 rounded px-3 py-2 mb-4
  focus:outline-none focus:ring-2 focus:ring-blue-400
`;

export default function AddWebinar() {
  const [formData, setFormData] = useState({
    title: "",
    beginning_date: "",
    end_date: "",
    venue: "",
    mode: "Online",
    expert: "",
    expert_experience: "",
    duration: "",
    price: "",
    description: "",
    part1: "",
    part2: "",
    part3: "",
    specialref: "",
    discount: "",
    secret_key: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [expertImageFile, setExpertImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === "image") setImageFile(files[0]);
    if (name === "expert_image") setExpertImageFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      payload.append(key, val);
    });
    if (imageFile) payload.append("image", imageFile);
    if (expertImageFile) payload.append("expert_image", expertImageFile);

    try {
      const res = await axios.post(`${BASE_URL}/addwebinar`, payload);
      showMessage("success", res.data.message || "Webinar added successfully!");
      setFormData({
        title: "",
        beginning_date: "",
        end_date: "",
        venue: "",
        mode: "Online",
        expert: "",
        expert_experience: "",
        duration: "",
        price: "",
        description: "",
        part1: "",
        part2: "",
        part3: "",
        specialref: "",
        discount: "",
        secret_key: "",
      });
      setImageFile(null);
      setExpertImageFile(null);
    } catch (err) {
      if (err.response?.status === 401) {
        showMessage("error", "Wrong secret key!");
      } else {
        showMessage("error", "Failed to submit webinar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-blue-100">
        {/* header */}
        <div className="mb-6 border-b border-blue-100 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Add New Webinar
          </h2>
          <p className="mt-1 text-sm text-blue-600">
            Fill in the details below to publish a new webinar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6"
        >
          {/* main details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Beginning Date
              </label>
              <input
                type="date"
                name="beginning_date"
                value={formData.beginning_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-blue-900 mb-1">
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

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Expert Name
              </label>
              <input
                type="text"
                name="expert"
                value={formData.expert}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Expert Experience
              </label>
              <input
                type="text"
                name="expert_experience"
                value={formData.expert_experience}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* description */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`${inputClass} h-28 resize-none`}
            />
          </div>

          {/* parts */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Agenda Parts
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["part1", "part2", "part3"].map((p) => (
                <div key={p}>
                  <label className="block text-xs font-medium text-blue-800 mb-1">
                    {p.replace("part", "Part ")}
                  </label>
                  <input
                    type="text"
                    name={p}
                    value={formData[p]}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Event Poster
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mb-2 block w-full text-sm text-blue-800"
              />
              <p className="text-xs text-blue-500">
                Upload a clear poster for the webinar.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Expert Image
              </label>
              <input
                type="file"
                name="expert_image"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mb-2 block w-full text-sm text-blue-800"
              />
              <p className="text-xs text-blue-500">
                Recommended: square image for best fit.
              </p>
            </div>
          </div>

          {/* ref + discount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Special Ref Code
              </label>
              <input
                type="text"
                name="specialref"
                value={formData.specialref}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* secret key */}
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">
              Secret Key
            </label>
            <input
              type="password"
              name="secret_key"
              value={formData.secret_key}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <p className="text-xs text-blue-500 mt-[-8px]">
              Only admins with the correct key can add webinars.
            </p>
          </div>

          {/* submit + message */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-md transition shadow-sm"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                "Submit Webinar"
              )}
            </button>

            {message.text && (
              <div
                className={`mt-4 p-3 rounded-md text-sm font-medium text-white text-center ${
                  message.type === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";

// const BASE_URL = "http://localhost:3000";

// // Shared input styling for blue theme
// const inputClass = `
//   w-full border border-blue-300 rounded px-3 py-2 mb-4
//   focus:outline-none focus:ring-2 focus:ring-blue-400
// `;

// export default function AddWebinar() {
//   const [formData, setFormData] = useState({
//     title: "",
//     beginning_date: "",
//     end_date: "",
//     venue: "",
//     mode: "Online",
//     expert: "",
//     expert_experience: "",
//     duration: "",
//     price: "",
//     description: "",
//     part1: "",
//     part2: "",
//     part3: "",
//     specialref: "",
//     discount: "",
//     secret_key: "",
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [expertImageFile, setExpertImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   const showMessage = (type, text) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage({ type: "", text: "" }), 4000);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const { name, files } = e.target;
//     if (name === "image") setImageFile(files[0]);
//     if (name === "expert_image") setExpertImageFile(files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = new FormData();
//     Object.entries(formData).forEach(([key, val]) => {
//       payload.append(key, val);
//     });
//     if (imageFile) payload.append("image", imageFile);
//     if (expertImageFile) payload.append("expert_image", expertImageFile);

//     try {
//       const res = await axios.post(`${BASE_URL}/addwebinar`, payload);
//       showMessage("success", res.data.message || "Webinar added successfully!");
//       setFormData({
//         title: "",
//         beginning_date: "",
//         end_date: "",
//         venue: "",
//         mode: "Online",
//         expert: "",
//         expert_experience: "",
//         duration: "",
//         price: "",
//         description: "",
//         part1: "",
//         part2: "",
//         part3: "",
//         specialref: "",
//         discount: "",
//         secret_key: "",
//       });
//       setImageFile(null);
//       setExpertImageFile(null);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         showMessage("error", "Wrong secret key!");
//       } else {
//         showMessage("error", "Failed to submit webinar.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-blue-50 min-h-screen py-8">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold text-blue-800 mb-6">Add New Webinar</h2>

//         <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-black mb-1">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block text-black mb-1">Venue</label>
//               <input
//                 type="text"
//                 name="venue"
//                 value={formData.venue}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>

//             <div>
//               <label className="block text-black mb-1">Beginning Date</label>
//               <input
//                 type="date"
//                 name="beginning_date"
//                 value={formData.beginning_date}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block text-black mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="end_date"
//                 value={formData.end_date}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>

//             <div className="sm:col-span-2">
//               <label className="block text-black mb-1">Mode</label>
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

//             <div>
//               <label className="block text-black mb-1">Expert Name</label>
//               <input
//                 type="text"
//                 name="expert"
//                 value={formData.expert}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block text-black mb-1">Expert Experience</label>
//               <input
//                 type="text"
//                 name="expert_experience"
//                 value={formData.expert_experience}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>

//             <div>
//               <label className="block text-black mb-1">Duration</label>
//               <input
//                 type="text"
//                 name="duration"
//                 value={formData.duration}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block text-black mb-1">Price (₹)</label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 required
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-black mb-1">Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               className={`${inputClass} h-24 resize-none`}
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {['part1', 'part2', 'part3'].map((p) => (
//               <div key={p}>
//                 <label className="block text-black mb-1">{p.replace('part', 'Part ')}</label>
//                 <input
//                   type="text"
//                   name={p}
//                   value={formData[p]}
//                   onChange={handleChange}
//                   className={inputClass}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-blue-700 mb-1">Event Poster</label>
//               <input
//                 type="file"
//                 name="image"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 required
//                 className="mb-4"
//               />
//             </div>
//             <div>
//               <label className="block text-blue-700 mb-1">Expert Image</label>
//               <input
//                 type="file"
//                 name="expert_image"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 required
//                 className="mb-4"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-black mb-1">Special Ref Code</label>
//               <input
//                 type="text"
//                 name="specialref"
//                 value={formData.specialref}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block text-black mb-1">Discount (%)</label>
//               <input
//                 type="number"
//                 name="discount"
//                 value={formData.discount}
//                 onChange={handleChange}
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-black mb-1">Secret Key</label>
//             <input
//               type="password"
//               name="secret_key"
//               value={formData.secret_key}
//               onChange={handleChange}
//               required
//               className={inputClass}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition"
//           >
//             {loading ? (
//               <svg
//                 className="mx-auto h-5 w-5 animate-spin text-white"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 />
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                 />
//               </svg>
//             ) : (
//               "Submit Webinar"
//             )}
//           </button>

//           {message.text && (
//             <div
//               className={`mt-4 p-3 rounded text-red text-center \$\{message.type === 'success' ? 'bg-green-500' : 'bg-red-500'\}`}>
//               {message.text}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
