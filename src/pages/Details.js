import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import SearchIcon from "@mui/icons-material/Search";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { packageActions } from "../redux/packageSlice";
import { styled, alpha } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Paginations from "../components/Pagination";
import axios from "axios";
import "./Details.css";
import AddIcon from "@mui/icons-material/Add";
import InputBase from "@mui/material/InputBase";

const initialValue = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
};
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#1976d2", 0.15),
  "&:hover": {
    backgroundColor: alpha("#1976d2", 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const Details = () => {
  const dispatch = useDispatch();

  let packages = useSelector((state) =>
    state.package.itemList ? state.package.itemList : []
  );
  let dataFromPackage = packages && packages.users ? packages.users : [];
  let dataStore = useSelector((state) =>
    state.package.dataList ? state.package.dataList : []
  );
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [tempObj, setTempObj] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [user, setUser] = useState(initialValue);
  const [totalData, setTotalData] = useState([user]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempAdd, setTempAdd] = useState(null);
  let NUM_OF_RECORDS = packages && packages.users ? packages.users.length : 0;
  let LIMIT = 5;

  const callPackages = async () => {
    await axios
      .get(`https://dummyjson.com/users`)
      .then((res) => {
        // console.log(res);
        dispatch(packageActions.addTopackage(res?.data));
        dispatch(packageActions.addToDataStore(res?.data));
        setTempObj(res?.data);
      })
      .catch((err) => console.error(err));
  };

  // Api Calling
  useEffect(() => {
    if (packages && packages !== null) {
      callPackages();
    }
  }, []);

  const onPageChanged = (event, page) => {
    event.preventDefault();
    return setCurrentPage(page);
  };
  let currentData =
    packages && packages.users
      ? packages.users.slice(
          (currentPage - 1) * LIMIT,
          (currentPage - 1) * LIMIT + LIMIT
        )
      : [];
  // Delete
  const handleDelete = (e, index) => {
    let deletedData = packages && packages.users ? [...packages.users] : [];
    let filteredData = [];
    deletedData.filter((item) => {
      if (item.id !== e.id) {
        filteredData.push(item);
      }
    });
    dispatch(packageActions.deleteData(filteredData));
  };

  // ToggleHandle
  const handleUpdate = (e, index) => {
    setOpen(true);
    setTempObj(e);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClose1 = () => {
    setOpenAdd(false);
  };
  const handleAddUpdate = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Update data
  const updateFinal = (e) => {
    let flteredData = [];
    let updateOne = [...dataFromPackage];
    updateOne.map((el) => {
      if (el.id === tempObj.id) {
        el = e;
      }
      flteredData.push(el);
    });
    setOpen(false);
    console.log("flteredData", flteredData);
    dispatch(packageActions.updateData(flteredData));
  };

  const handleFilter = (nameKey = "id", e) => {
    let dataArray = [];
    if (e && e !== null) {
      dataStore.users
        .filter((data) => {
          for (const key in data) {
            if (key === nameKey) {
              return data[key]
                .toString()
                .trim()
                .toLowerCase()
                .match(e.toLowerCase());
            }
          }
        })
        .map((item) => {
          dataArray.push(item);
          // dispatch(packageActions.addTopackage(dataArray));
        });
    } else {
      dataArray = dataStore.users;
    }
    dispatch(packageActions.addToData(dataArray));
  };
  const handleFilterGlobe = (e) => {
    let dataArray = [];
    if (e && e !== null) {
      dataStore.users
        .filter((data) => {
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];
              if (typeof element === "string") {
                if (
                  element
                    .toString()
                    .replace(/^\s+|\s+$/gm, "")
                    .toLowerCase()
                    .match(
                      e
                        .toString()
                        .replace(/^\s+|\s+$/gm, "")
                        .toLowerCase()
                    )
                ) {
                  console.log(data);
                  return data;
                }
              }
            }
          }
          // return data[key]
          //   .toString()
          //   .trim()
          //   .toLowerCase()
          //   .match(e.toLowerCase());
        })
        .map((item) => {
          dataArray.push(item);
          // dispatch(packageActions.addTopackage(dataArray));
        });
    } else {
      dataArray = dataStore.users;
    }
    dispatch(packageActions.addToData(dataArray));
  };

  const handleAddUser = (event) => {
    console.log(event);
    if (event !== null && event !== undefined) {
      event.id = 1;
      dispatch(packageActions.addNewUser(event));
      setOpenAdd(false);
    } else {
      alert("Try to add null value!");
    }
  };
  return (
    <>
      {/* {currentData ? ( */}
      <>
        <Row className="m-5">
          <Col>
            <h1>User Details</h1>
          </Col>
          <Col className="text-end">
            <Row>
              <Col>
                {/* <TextField
                  hiddenLabel
                  id="filled-hidden-label-small"
                  defaultValue="Search"
                  variant="filled"
                  size="small"
                /> */}
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    onChange={(e) => handleFilterGlobe(e.target.value)}
                  />
                </Search>
              </Col>
              <Col>
                <Button
                  variant="contained"
                  onClick={() => handleAddUpdate(tempAdd)}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Dialog open={open} fullWidth>
          <DialogTitle>
            {tempObj.firstName + " " + tempObj.lastName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={tempObj.firstName}
                      onChange={(e) =>
                        setTempObj({ ...tempObj, firstName: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder=""
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={tempObj.email}
                      onChange={(e) =>
                        setTempObj({ ...tempObj, email: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder=""
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={tempObj.phone}
                      onChange={(e) =>
                        setTempObj({ ...tempObj, phone: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder=""
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Age</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={tempObj.age}
                      onChange={(e) =>
                        setTempObj({ ...tempObj, age: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder=""
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Gender</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={tempObj.gender}
                      onChange={(e) =>
                        setTempObj({ ...tempObj, gender: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder=""
                    />
                  </div>
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={() => updateFinal(tempObj)}>Update</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openAdd} fullWidth>
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={""}
                      onChange={(e) =>
                        setTempAdd({ ...tempAdd, firstName: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder="E.g John"
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={""}
                      onChange={(e) =>
                        setTempAdd({ ...tempAdd, email: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder="E.g John@email.com"
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={""}
                      onChange={(e) =>
                        setTempAdd({ ...tempAdd, phone: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder="E.g 0000 000 000"
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={0}
                      onChange={(e) =>
                        setTempAdd({ ...tempAdd, age: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder="E.g 12"
                    />
                  </div>
                </Col>
              </Row>
              <Row style={{ width: "100%" }}>
                <Col>
                  <div className="form-group">
                    <label htmlFor="">Gender</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={""}
                      onChange={(e) =>
                        setTempAdd({ ...tempAdd, gender: e.target.value })
                      }
                      name=""
                      id=""
                      aria-describedby="helpId"
                      placeholder="E.g male"
                    />
                  </div>
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose1}>Close</Button>
            <Button onClick={() => handleAddUser(tempAdd)}>Update</Button>
          </DialogActions>
        </Dialog>
        <Row className="m-5 body d-block">
          <Col className="table_container">
            <table className="table">
              <thead>
                <tr>
                  <th className="">
                    <span className="p-0 m-0">ID</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "5rem" }}
                      placeholder="e.g 1"
                      autoComplete="false"
                      onChange={(e) => handleFilter("id", e.target.value)}
                    />
                  </th>
                  <th>
                    <span className="p-0 m-0">Name</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "5rem" }}
                      placeholder="e.g John"
                      autoComplete="false"
                      onChange={(e) =>
                        handleFilter("firstName", e.target.value)
                      }
                    />
                  </th>
                  <th>
                    <span className="p-0 m-0">Email</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "15rem" }}
                      placeholder="e.g john@gmail.com"
                      autoComplete="false"
                      onChange={(e) => handleFilter("email", e.target.value)}
                    />
                  </th>
                  <th>
                    <span className="p-0 m-0">Mobile</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "10rem" }}
                      placeholder="e.g 000000000"
                      autoComplete="false"
                      onChange={(e) => handleFilter("phone", e.target.value)}
                    />
                  </th>
                  <th>
                    <span className="p-0 m-0">Age</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "5rem" }}
                      placeholder="e.g 12"
                      autoComplete="false"
                      onChange={(e) => handleFilter("age", e.target.value)}
                    />
                  </th>
                  <th>
                    <span className="p-0 m-0">Gender</span>
                    <br />
                    <input
                      className="p-0 m-0"
                      id="filled-basic"
                      label="Filled"
                      variant="filled"
                      style={{ width: "5rem" }}
                      placeholder="e.g male"
                      autoComplete="false"
                      onChange={(e) => handleFilter("gender", e.target.value)}
                    />
                  </th>
                  <th>
                    <span className="mb-4">Actions</span>
                    {/* <br /> */}
                    {/* <input
                        className="p-0 m-0"
                        id="filled-basic"
                        hidden
                        label="Filled"
                        variant="filled"
                        style={{ width: "5rem" }}
                      /> */}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData ? (
                  currentData.map((el, index) => {
                    return (
                      <tr key={index}>
                        <td scope="row">{index + el.id}</td>
                        <td>{el.firstName}</td>
                        <td>{el.email}</td>
                        <td>{el.phone}</td>
                        <td>{el.age}</td>
                        <td>{el.gender}</td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "4rem",
                          }}
                        >
                          <p
                            style={{ cursor: "pointer", color: "#7300aa" }}
                            onClick={(event) => {
                              handleUpdate(el, index);
                            }}
                          >
                            <BiEdit />
                          </p>
                          <p
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={(event) => {
                              handleDelete(el, index);
                            }}
                          >
                            <MdDelete />
                          </p>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <Row>
                    <Col>No Data</Col>
                  </Row>
                )}
              </tbody>
            </table>
          </Col>
          <Col className="">
            {currentData && currentData.length > 0 ? (
              <Paginations
                totalRecords={NUM_OF_RECORDS}
                pageLimit={LIMIT}
                pageNeighbours={2}
                onPageChanged={onPageChanged}
                currentPage={currentPage}
              />
            ) : null}
          </Col>
        </Row>
      </>
      {/* ) : null} */}
    </>
  );
};

export default Details;
