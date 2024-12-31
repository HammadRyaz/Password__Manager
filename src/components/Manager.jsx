import Heading from "./Heading";
import React, { useState, useRef, useEffect } from "react";

import {
  Popconfirm,
  message,
  Tooltip,
  Skeleton,
  Spin,
  Typography,
  Pagination,
  Empty,
  Button,
  Popover,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
function Manager() {
  const passRefVisible = useRef({ passInput: null, passIcon: null });
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for the data
  const [open, setOpen] = useState(false);
  const [PasswordSavedMessage, setPasswordSavedMessage] = useState("Saved"); // Loading state for the data
  const [PasswordSavedMessageType, setPasswordSavedMessageType] =
    useState("info"); // Loading state for the data
  const [deletedPassword, setDeletedPassword] = useState(null); // Temporarily store deleted password
  const deletedPasswordId = useRef(null); // Track the ID of the last deleted password
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [isEditEnable, setisEditEnable] = useState(false);
  // Handle the save password button and log the form data
  const handleFormPasswordSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  // Handle the password Visibility Icon  and change the type of password input
  const handleVisiblePassword = (e) => {
    if (passRefVisible.current.passInput.type === "password") {
      passRefVisible.current.passInput.type = "text";
      passRefVisible.current.passIcon.src = "/Password__Manager/assets/eye.png";
    } else {
      passRefVisible.current.passInput.type = "password";
      passRefVisible.current.passIcon.src = "/Password__Manager/assets/eyecross.png";
    }
  };

  const displayPasswordSavedMessage = () => {
    messageApi.open({
      key,
      type: "loading",
      content: "Saving Password...",
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type: PasswordSavedMessageType,
        content: PasswordSavedMessage,
        duration: 3,
      });
    }, 1000);
  };

  const displayPasswordCopyMessage = () => {
    messageApi.open({
      type: "info",
      content: " Copied to Clipboard",
      duration: 1.4,
    });
  };

  // Handle the form input change and set the form state with the new value
  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSavePassword = () => {
    if (form.site && form.username && form.password) {
      setIsSaving(true); // Start saving
      setPasswordSavedMessageType("success");
      setPasswordSavedMessage("Password Saved successfully");
      setisEditEnable(false);
      displayPasswordSavedMessage(); // Show saving message
      setTimeout(() => {
        setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
        localStorage.setItem(
          "passwords",
          JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
        );
        setform({ site: "", username: "", password: "" });
        setIsSaving(false); // End saving
      }, 1000); // simulate a save delay of 1 second
    }
  };

  useEffect(() => {
    setTimeout(() => {
      let passwords = localStorage.getItem("passwords");
      if (passwords) {
        setPasswordArray(JSON.parse(passwords));
      }
      setLoading(false);
      toast.success("All Content Loaded", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // data is fetched, so set loading to false
    }, 2000); // simulate a delay of 2 seconds
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && form.site && form.username && form.password) {
      handleSavePassword();
      setisEditEnable(false);
    }
  };

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item);
    displayPasswordCopyMessage();
  };

  const handleAllCopy = (site, username, password) => {
    const textToCopy = `Site: ${site}, Username: ${username}, Password: ${password}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        displayPasswordCopyMessage();
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  // const deletePassword = (id) => {
  //   console.log(id);
  //   const cnfrm = confirm("Do You Really want to delete ??");
  //   if (cnfrm) {
  //     setPasswordArray(passwordArray.filter((item) => item.id != id));
  //     localStorage.setItem(
  //       "passwords",
  //       JSON.stringify(passwordArray.filter((item) => item.id != id))
  //     );
  //     messageApi.open({
  //       type: "success",
  //       content: "Password Delete Successfully",
  //       duration: 1.4,
  //     });
  //   }
  // };
  const editPassword = (id) => {
    console.log(id);
    setform(passwordArray.filter((item) => item.id === id)[0]);
    setisEditEnable(true);
    setPasswordArray(passwordArray.filter((item) => item.id != id));
    setPasswordSavedMessage("Password Update successfully");
    setPasswordSavedMessageType("success");
  };
  // Function to handle password deletion
  const confirm = (id) => {
    const passwordToDelete = passwordArray.find((item) => item.id === id);

    // Remove the password from the array and update localStorage
    const updatedPasswordArray = passwordArray.filter((item) => item.id !== id);
    setPasswordArray(updatedPasswordArray);
    localStorage.setItem("passwords", JSON.stringify(updatedPasswordArray));

    // Temporarily save the deleted password and its ID
    setDeletedPassword(passwordToDelete);
    deletedPasswordId.current = id;

    // Show the warning toast notification
    toast.warn("Use Ctrl+Z to undo delete", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: toast.slide, // Corrected transition prop
    });

    // Show success message
    message.success("Password Deleted");
  };

  // Function to handle cancellation
  const cancel = (e) => {
    console.log(e);
    message.error("Delete Cancelled");
  };

  // Undo deleted password when Ctrl+Z is pressed
  const handleKeyDownUndo = (event) => {
    if (event.ctrlKey && event.key === "z" && deletedPassword) {
      // Restore the last deleted password if any
      setPasswordArray((prevArray) => [...prevArray, deletedPassword]);
      localStorage.setItem(
        "passwords",
        JSON.stringify([...passwordArray, deletedPassword])
      );
      setDeletedPassword(null); // Clear the temporary deleted password
      message.warning("Password Restored");
    }
  };

  useEffect(() => {
    // Add event listener for keydown (Ctrl+Z)
    window.addEventListener("keydown", handleKeyDownUndo);
    return () => {
      window.removeEventListener("keydown", handleKeyDownUndo);
    };
  }, [deletedPassword, passwordArray]); // Re-run effect if deletedPassword or passwordArray changes
  // Get current passwords to display on the current page
  const currentPasswords = passwordArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen, id) => {
    setOpen(newOpen ? id : null);
  };
  const handleClear = (field) => {
    setform({
      ...form, // Keep other fields unchanged
      [field]: "", // Clear the specified field
    });
  };
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="bg-custom min-h-screen">
          {contextHolder}

          <Heading />

          <div className="flex justify-center items-center bg-overlay">
            <div className="py-6 px-8 w-full max-w-2xl">
              {/* Form Loader (Skeleton Loader) */}
              {loading ? (
                <Skeleton active paragraph={{ rows: 5 }} />
              ) : (
                <form
                  autoComplete="on"
                  onKeyDown={handleKeyDown}
                  onSubmit={handleFormPasswordSubmit}
                  className="w-full rounded-2xl bg-radial-gradien "
                >
                  <div className="relative mb-6 bg-white">
                    <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                      Website Url
                    </label>
                    <input
                      type="text"
                      name="site" // Make sure the input field name matches the state property
                      value={form.site} // This is the value bound to the state
                      onChange={handleChange} // This updates the state when the input changes
                      className="block w-full h-14 px-6 py-3 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none shadow pr-10"
                      placeholder="https://example.com"
                      required
                    />
                    {/* Cross button to clear the 'site' input */}
                    {form.site && (
                      <button
                        type="button"
                        onClick={() => handleClear("site")} // Clear the 'site' value when clicked
                        className="absolute top-2/3 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/zxvuvcnc.json"
                          trigger="hover"
                          colors="primary:#c71f16"
                          onClick={hide}
                          style={{ width: "25px", height: "25px" }}
                        ></lord-icon>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-x-6 mb-6">
                    <div className="w-full sm:w-1/2 relative mb-4 sm:mb-0">
                      <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                        Username
                      </label>
                      <input
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        className="block w-full h-14 px-6 py-3 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none shadow"
                        placeholder="Enter Username"
                        required
                        name="username"
                      />
                      {/* Cross button to clear the 'site' input */}
                      {form.username && (
                        <button
                          type="button"
                          onClick={() => handleClear("username")} // Clear the 'site' value when clicked
                          className="absolute top-2/3 right-4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/zxvuvcnc.json"
                            trigger="hover"
                            colors="primary:#c71f16"
                            onClick={hide}
                            style={{ width: "25px", height: "25px" }}
                          ></lord-icon>
                        </button>
                      )}
                    </div>

                    <div className="w-full sm:w-1/2 relative">
                      <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <img
                          src="/Password__Manager/assets/eyecross.png"
                          alt="Password Icon"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6"
                          onClick={handleVisiblePassword}
                          ref={(el) => (passRefVisible.current.passIcon = el)}
                        />
                        <input
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          className="block w-full h-14 pl-6 pr-14 py-3 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none shadow"
                          placeholder="Enter Password"
                          required
                          ref={(el) => (passRefVisible.current.passInput = el)}
                          name="password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSavePassword}
                    disabled={isSaving}
                    className={`w-full sm:w-52 uppercase flex justify-center items-center gap-1 h-14 shadow-sm rounded-full transition-all duration-700 text-lg font-semibold leading-7 ${
                      isSaving
                        ? "bg-gray-400 cursor-wait"
                        : "bg-green-600 hover:bg-green-800 text-white"
                    }`}
                  >
                    {isSaving ? (
                      ""
                    ) : (
                      <lord-icon
                        src="https://cdn.lordicon.com/jgnvfzqg.json"
                        trigger="hover"
                        colors="primary:#fff"
                      />
                    )}
                    {isSaving ? <Spin tip="Loading" size="large" /> : "Save"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Table with Skeleton Loader */}

          <div className="overflow-x-auto m-2 md:m-5 rounded-md ">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg shadow overflow-hidden">
                <Skeleton loading={loading} active paragraph={{ rows: 5 }}>
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-green-600 ">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs text-white font-black uppercase"
                        >
                          NO
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs text-white font-black uppercase"
                        >
                          Site url
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs text-white font-black uppercase"
                        >
                          Username
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs text-white font-black uppercase"
                        >
                          Password
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-end text-xs text-white font-black uppercase"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPasswords.length > 0 &&
                        currentPasswords.map((password, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-100 hover:bg-gray-100"
                          >
                            <td className=" font-serif border-r-2 text-center font-black whitespace-nowrap text-xl text-gray-800">
                              <span className="mt-1">{index + 1}</span>
                            </td>
                            <td className="px-6 py-4 gap-5 flex item-center whitespace-nowrap text-sm font-medium text-gray-800">
                              <lord-icon
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                                onClick={() => handleCopy(password.site)}
                                colors="primary:#0063a0"
                                style={{ width: "25px", height: "25px" }}
                              ></lord-icon>
                              <span className="mt-1 hover:underline hover:text-yellow-500 ">
                                <a target="_blank" href={password.site}>
                                  {password.site}
                                </a>
                              </span>
                            </td>

                            <td className="px-6 py-4 gap-5 whitespace-nowrap text-sm text-gray-800 font-medium">
                              <lord-icon
                                src="https://cdn.lordicon.com/iykgtsbt.json"
                                trigger="hover"
                                onClick={() => handleCopy(password.username)}
                                colors="primary:#0063a0"
                                style={{ width: "25px", height: "25px" }}
                              ></lord-icon>
                              &nbsp;&nbsp;&nbsp;{password.username}
                            </td>

                            <td className="px-6 py-4 gap-5 flex whitespace-nowrap text-sm text-gray-800 font-medium">
                              <Popover
                                content={
                                  <div className="flex gap-2 justify-center items-center border-t-2 pt-1 border-slate-400 ">
                                    {/* Copy Icon */}
                                    <lord-icon
                                      src="https://cdn.lordicon.com/iykgtsbt.json"
                                      trigger="hover"
                                      onClick={() =>
                                        handleCopy(password.password)
                                      }
                                      colors="primary:#0063a0"
                                      style={{
                                        width: "25px",
                                        height: "25px",
                                        marginRight: "10px",
                                      }}
                                    ></lord-icon>

                                    {/* Close Icon */}
                                    <lord-icon
                                      src="https://cdn.lordicon.com/zxvuvcnc.json"
                                      trigger="hover"
                                      colors="primary:#c71f16"
                                      onClick={hide}
                                      style={{ width: "25px", height: "25px" }}
                                    ></lord-icon>
                                  </div>
                                }
                                title={
                                  <span class="text-lg font-semibold text-yellow-500  ">
                                    {password.password}
                                    {/* <hr /> */}
                                  </span>
                                }
                                trigger="click"
                                open={open === password.id}
                                onOpenChange={(newOpen) =>
                                  handleOpenChange(newOpen, password.id)
                                }
                              >
                                <lord-icon
                                  src="https://cdn.lordicon.com/drdlomqk.json"
                                  trigger="click"
                                ></lord-icon>
                              </Popover>
                              <span className="mt-1">
                                {"*".repeat(password.password.length)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                              <button
                                type="button"
                                className="gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                <Tooltip
                                  placement="topRight"
                                  title={
                                    !isEditEnable
                                      ? "Edit Password"
                                      : "Edit Disabled"
                                  }
                                  color={!isEditEnable ? "#008a00" : "#555"}
                                  style={{
                                    pointerEvents: isEditEnable
                                      ? "none"
                                      : "auto",
                                  }}
                                >
                                  <lord-icon
                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                    trigger="hover"
                                    colors="primary:#00a652"
                                    onClick={() => {
                                      if (!isEditEnable) {
                                        editPassword(password.id);
                                      }
                                    }}
                                    style={{
                                      opacity: isEditEnable ? 0.4 : 1,
                                    }}
                                  ></lord-icon>
                                </Tooltip>
                                <Tooltip
                                  placement="topLeft"
                                  title="Delete Password"
                                  color="#c02215"
                                >
                                  <Popconfirm
                                    title="Delete the task"
                                    description="Are you sure to delete this task?"
                                    onConfirm={() => confirm(password.id)} // Call confirm with the correct ID when confirmed
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                    placement="topRight"
                                  >
                                    <lord-icon
                                      src="https://cdn.lordicon.com/skkahier.json"
                                      trigger="hover"
                                      colors="primary:#D30000"
                                    ></lord-icon>
                                  </Popconfirm>
                                </Tooltip>
                                <Tooltip
                                  placement="topRight"
                                  title="Copy All"
                                  color="#1a293b"
                                >
                                  <lord-icon
                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                    trigger="click"
                                    onClick={() =>
                                      handleAllCopy(
                                        password.site,
                                        password.username,
                                        password.password
                                      )
                                    }
                                    colors="primary:#1a293b"
                                  ></lord-icon>
                                </Tooltip>
                              </button>
                            </td>
                          </tr>
                        ))}
                      {passwordArray.length <= 0 && (
                        <tr>
                          <td colSpan={5}>
                            <Empty
                              imageStyle={{
                                height: 160,
                                marginTop: 20,
                              }}
                            >
                              <Button
                                type="primary"
                                onClick={handleSavePassword}
                                disabled={isSaving}
                                className={`shadow-sm mb-5 transition-all duration-700 text-lg font-semibold leading-7 ${
                                  isSaving
                                    ? "bg-gray-400 cursor-wait"
                                    : "bg-slate-400 hover:bg-slate-500 text-white"
                                }`}
                              >
                                {isSaving ? (
                                  <Spin tip="Creating.." size="small" />
                                ) : (
                                  "Create"
                                )}
                              </Button>
                            </Empty>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {passwordArray.length > itemsPerPage && (
                    <Pagination
                      current={currentPage}
                      total={passwordArray.length}
                      pageSize={itemsPerPage}
                      onChange={onPageChange}
                      showSizeChanger={false} // Disable size changer if you want a fixed page size
                      className="text-center mt-5 mb-2"
                    />
                  )}
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Manager;
