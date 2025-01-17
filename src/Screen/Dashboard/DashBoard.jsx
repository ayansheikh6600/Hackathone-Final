import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  auth,
  db,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "../../Firebase/firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { IoMdPerson, IoIosCalendar } from "react-icons/io";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DashBoard = () => {
  const navigator = useNavigate("");
  const [Users, SetUsers] = useState([]);

  const Signout = () => {
    localStorage.clear();
    navigator("/");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log(user)
    if (!user) {
      navigator("/");
    }

    const GetUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const TempAry = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        TempAry.push(doc.data());
      });
      // console.log(TempAry)
      SetUsers([...TempAry]);
    };
    GetUsers();
  }, []);

  // console.log(Users);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [Email, SetEmail] = useState("");
  const [Password, SetPassword] = useState("");
  const [PhoneNo, SetPhoneNo] = useState("");
  const [Course, SetCourse] = useState("");
  const [FirstName, SetFirstName] = useState("");
  const [LastName, SetLastName] = useState("");
  const [image, SetImage] = useState("");
  const [currentPage, setCurrentPage] = useState("Students");
  var i = 1;
  const studentIcon = (
    <IoMdPerson className="text-[#15304A] rounded-full bg-blue-100 mx-3" />
  );
  const attendanceIcon = (
    <IoIosCalendar className="text-[#15304A] rounded-full bg-blue-100 mx-3" />
  );
  const [imagePreview, SetimagePreview] = useState(null);

  //   console.log(image);

  const closeModal = () => {
    handleClose();
    SetCourse("");
    SetEmail("");
    SetPassword("");
    SetPhoneNo("");
    SetFirstName("");
    SetLastName("");
    SetImage("");
    SetimagePreview(null);
  };

  const HandleImage = (e) => {
    // console.log(e);

    const image = e.target.files[0];

    if (image) {
      const reader = new FileReader();
      //   console.log("sss");

      reader.onload = (e) => {
        SetimagePreview(e.target.result);
        // console.log("sss");
      };

      reader.readAsDataURL(image);
    } else {
      SetimagePreview(null);
    }
  };

  //   console.log(imagePreview);

  const AddUser = () => {
    const notify = () => toast("Feild Misisng!");

    if (
      !Email ||
      !Password ||
      !PhoneNo ||
      !Course ||
      !FirstName ||
      !LastName ||
      !image
    ) {
      notify();
      return;
    }

    // return

    createUserWithEmailAndPassword(auth, Email, Password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;

        const storage = getStorage();

        // Create the file metadata
        /** @type {any} */
        const metadata = {
          contentType: "image/jpeg",
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, "images/" + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case "storage/unauthorized":
                // User doesn't have permission to access the object
                break;
              case "storage/canceled":
                // User canceled the upload
                break;

              // ...

              case "storage/unknown":
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
          },
          async () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                const obj = {
                  FirstName,
                  LastName,
                  PhoneNo,
                  userType: "user",
                  image: downloadURL,
                  Email,
                  Course,
                  Id: user.uid,
                  Attendance: [],
                };
                await setDoc(doc(db, "users", user.uid), obj);

                handleClose();
                SetCourse("");
                SetEmail("");
                SetPassword("");
                SetPhoneNo("");
                SetFirstName("");
                SetLastName("");
                SetImage("");
                SetimagePreview(null);
              }
            );
          }
        );

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="flex h-screen">
        <div className="w-1/5 text-black p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h1 className="font-bold text-lg text-[#15304A]">
                Attendance App
              </h1>
            </div>
            <div
              className={`flex items-center cursor-pointer mb-4 ${
                currentPage === "Students" ? "font-bold" : ""
              }`}
              onClick={() => setCurrentPage("Students")}
            >
              {studentIcon}
              Students
            </div>
            <div
              className={`flex items-center cursor-pointer mb-4 ${
                currentPage === "Attendance" ? "font-bold" : ""
              }`}
              onClick={() => setCurrentPage("Attendance")}
            >
              {attendanceIcon}
              Attendance
            </div>
          </div>
          <div
            className="mt-auto cursor-pointer bg-[#15304A] text-center text-white font-semibold rounded-lg p-1"
            onClick={Signout}
          >
            Logout
          </div>
        </div>

        <div className="w-4/5 p-6 bg-gray-100">
          <div className="text-2xl font-bold mb-6 flex items-center">
            <span className="ml-2 flex text-[#15304A] mt-2">
              {currentPage === "Students" ? studentIcon : attendanceIcon}
            </span>
            <span className="ml-2 flex text-[#15304A] mt-2">
              {currentPage === "Students" ? "Students" : "Attendance"}
            </span>
          </div>

          <div className="flex justify-between mb-6 items-center">
            <div></div>
            <button
              onClick={handleOpen}
              className="p-2 bg-[#15304A] text-white rounded-full"
            >
              Add Student
            </button>
          </div>

          {/* Modal */}

          {currentPage === "Students" ?(<div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              {currentPage === "Students"
                ? "Student Information"
                : "Attendance Information"}
            </h2>
            <div className="flex  bg-[#15304A] text-white p-3 rounded-lg">
              <div className="w-1/6">ID</div>
              <div className="w-1/6">Profile Img</div>
              <div className="w-1/6">Full Name</div>

              <div className="w-1/6">Course Name</div>
            </div>
            {/* Placeholder data (replace with actual data) */}
            {Users.map((items, index) => {
              if (items.userType !== "Admin") {
                return (
                  <div className="flex border-b py-2 " key={index}>
                    <div className="w-1/6">{i++}</div>
                    <div className="w-1/6">
                      <img
                        width={50}
                        height={50}
                        style={{ borderRadius: 100 }}
                        src={items.image}
                        alt=""
                      />
                    </div>
                    <div className="w-1/6">
                      {items.FirstName + " " + items.LastName}
                    </div>

                    <div className="w-1/6">{items.Course}</div>
                  </div>
                );
              }
            })}
          </div>):
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">
              {currentPage === "Students"
                ? "Student Information"
                : "Attendance Information"}
            </h2>
            <div className="flex  bg-[#15304A] text-white p-3 rounded-lg">
              <div className="w-1/6">ID</div>
              <div className="w-1/6">Profile</div>
              <div className="w-1/6">Full Name</div>

              <div className="w-1/6">Course Name</div>

              <>
                <div className="w-1/6">Checked In Time</div>
                <div className="w-1/6">Checked Out Time</div>
              </>
            </div>
            {/* Placeholder data (replace with actual data) */}
            
            {Users.map((items, index) => {
              if (items.userType !== "Admin") {
                return (
                  <div className="flex border-b py-2 " key={index}>
                    <div className="w-1/6">{i++}</div>
                    <div className="w-1/6">
                      <img
                        width={50}
                        height={50}
                        style={{ borderRadius: 100 }}
                        src={items.image}
                        alt=""
                      />
                    </div>
                    <div className="w-1/6">
                      {items.FirstName + " " + items.LastName}
                    </div>

                    <div className="w-1/6">{items.Course}</div>
                    <div className="w-1/6">{new Date(items.Attendance[items.Attendance.length - 1] && items.Attendance[items.Attendance.length - 1].CheckInTime).toString()}</div>
                    <div className="w-1/6">{new Date(items.Attendance[items.Attendance.length - 1] && items.Attendance[items.Attendance.length - 1].CheckOutTime).toString()}</div>
                  </div>
                );
              }
            })}
          </div>}
        </div>
      </div>

      {/* // Modal */}
      {/* <Button>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="bg-blue-500 rounded-[100px]"
              style={{ width: "200px", height: "200px" }}
            >
              <img
                src={imagePreview}
                alt=""
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#15304A",
                  borderRadius: 100,
                }}
              />
            </div>
            <input
              type="file"
              onChange={(e) => {
                SetImage(e.target.files[0]), HandleImage(e);
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: "row",
              marginTop: 5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="outlined-basic"
                label="FirstName"
                variant="outlined"
                onChange={(e) => {
                  SetFirstName(e.target.value);
                }}
                value={FirstName}
              />
              <TextField
                id="outlined-basic"
                label="LastName"
                variant="outlined"
                onChange={(e) => {
                  SetLastName(e.target.value);
                }}
                value={LastName}
                
                
              />
              <TextField
                id="outlined-basic"
                label="Phone"
                variant="outlined"
                onChange={(e) => {
                  SetPhoneNo(e.target.value);
                }}
                value={PhoneNo}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                onChange={(e) => {
                  SetEmail(e.target.value);
                }}
                value={Email}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                onChange={(e) => {
                  SetPassword(e.target.value);
                }}
                type="password"
                value={Password}
              />
              <TextField
                id="outlined-basic"
                label="Course Name"
                variant="outlined"
                onChange={(e) => {
                  SetCourse(e.target.value);
                }}
                value={Course}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              marginTop: 5,
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#15304A",
                "&:hover": { backgroundColor: "#25496b" },
              }}
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#15304A",
                "&:hover": { backgroundColor: "#25496b" },
              }}
              onClick={AddUser}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default DashBoard;
