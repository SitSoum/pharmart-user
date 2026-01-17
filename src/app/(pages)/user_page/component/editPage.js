import { useState } from "react";

const UserEdit = () => {
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");

  const [editMode, toggleEditMode] = useState(false);

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10">
      
      {/* --- Edit / Done Buttons --- */}
      <div className="w-full flex justify-end mb-4">
        {!editMode ? (
          <button
            className="text-green-600 font-semibold hover:underline transition"
            disabled={true}
          >
            Edit
          </button>
        ) : (
          <div className="flex justify-end gap-4">
            <button
              className="text-gray-500 hover:underline transition"
              onClick={() => toggleEditMode(false)}
            >
              Cancel
            </button>
            <button
              className="text-green-600 font-semibold hover:underline transition"
              onClick={() => toggleEditMode(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* --- Profile Picture --- */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-green-600">
          <img
            src="/assets/cat_profile.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="mt-2 text-green-600 font-medium hover:underline transition">
          Add photo
        </button>
      </div>

      {/* --- Form --- */}
      <form className="flex flex-col w-full gap-4">
        {/* First Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-sm text-gray-700">First Name</label>
          {!editMode ? (
            <span className="text-lg text-gray-900">{userInfo.first_name || "-"}</span>
          ) : (
            <input
              type="text"
              placeholder="John"
              className="outline-none border-b-2 border-gray-300 focus:border-green-600 text-lg py-1"
            />
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="font-semibold text-sm text-gray-700">Last Name</label>
          {!editMode ? (
            <span className="text-lg text-gray-900">{userInfo.last_name || "-"}</span>
          ) : (
            <input
              type="text"
              placeholder="Du"
              className="outline-none border-b-2 border-gray-300 focus:border-green-600 text-lg py-1"
            />
          )}
        </div>

        <hr className="border-gray-200 my-4" />

         {/* Email */}
        <div className="flex flex-col">
          <label className="font-semibold text-sm text-gray-700">
            Email
          </label>
          <span className="text-lg text-gray-900 wrap-break-word">
            {userInfo.email || "-"}
          </span>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label className="font-semibold text-sm text-gray-700">Phone Number</label>
          <span className="text-lg text-gray-900">{userInfo.phone_number || "-"}</span>
        </div>
      </form>
    </div>
  );
};

export default UserEdit;
