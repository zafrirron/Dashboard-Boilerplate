import React, { useEffect, useState, useMemo } from "react";
import { useTable, usePagination, useSortBy, useFilters } from "react-table";
import axios from "axios";
import Modal from "react-modal";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  Alert,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// Set the app element to your root div (or whatever element wraps your entire app)
Modal.setAppElement("#root");

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    maxHeight: "80vh",
    overflowY: "auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const StrapiTable = ({ collectionName, collectionTypeName, collectionMetaName }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterInput, setFilterInput] = useState("");
  const [formError, setFormError] = useState(null);

  const strapiApiKey = process.env.REACT_APP_STRAPI_AUTH_API;
  const strapiHost = process.env.REACT_APP_STRAPI_HOST || "localhost";
  const strapiPort = process.env.REACT_APP_STRAPI_PORT || "1337";

  const headers = {
    Authorization: `Bearer ${strapiApiKey}`,
  };

  const attributesToAdd = ["columnIsVisible", "columnIsEditable"];

  function mergeAttributes(originalArray, newAttributesArray, attributesToAdd) {
    if (!Array.isArray(newAttributesArray)) {
      console.error("newAttributesArray should be an array.");
      return originalArray;
    }

    return originalArray.map((originalItem) => {
      const matchingItem = newAttributesArray.find(
        (newItem) => newItem.fieldName === originalItem.fieldName
      );

      if (matchingItem) {
        attributesToAdd.forEach((attr) => {
          if (matchingItem[attr] !== undefined) {
            originalItem[attr] = matchingItem[attr];
          }
        });
      }

      return originalItem;
    });
  }

  const fetchMetadata = async () => {
    try {
      const collectionMd = await axios.get(
        `http://${strapiHost}:${strapiPort}/api/content-type-builder/content-types/api::${collectionTypeName}.${collectionTypeName}`,
        { headers }
      );
      const attributesObject = collectionMd.data.data.schema.attributes;
      const meta = Object.entries(attributesObject).map(([fieldName, attributes]) => ({
        fieldName,
        ...attributes,
      }));
  
      // Add built-in columns like 'documentId'
      meta.unshift({ fieldName: "documentId", type: "integer", columnIsVisible: false, columnIsEditable: false });

      let metaNew = meta;
  
      try {
        const collectionAddedMd = await axios.get(
          `http://${strapiHost}:${strapiPort}/api/${collectionMetaName}`,
          { headers }
        );
  
        metaNew = mergeAttributes(meta, collectionAddedMd.data.data, attributesToAdd);
      } catch (error) {
        console.warn(
          `Error fetching additional metadata for collection: ${collectionName}. Falling back to default attributes.`
        );
      }
  
      setMetadata(metaNew);
  
      // If `metaNew` contains all fields without filtering, it will include all fields.
      const dynamicColumns = metaNew
        .filter((field) => field.columnIsVisible || field.columnIsVisible === undefined)
        .map((field) => ({
          Header: field.fieldName.charAt(0).toUpperCase() + field.fieldName.slice(1),
          accessor: field.fieldName,
        }));
  
      dynamicColumns.push({
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={() => {openEditModal(row.original)}}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => {openViewModal(row.original)}}>
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={() => deleteRecord(row.original.documentId)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      });
  
      setColumns(dynamicColumns);
    } catch (error) {
      setError(`Error fetching metadata for collection: ${collectionName}`);
    }
  };
  

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${strapiHost}:${strapiPort}/api/${collectionName}`, {
        headers,
      });
      const tableData = response.data.data.map((item) => ({ ...item }));
      setData(tableData);
    } catch (error) {
      setError(`Error fetching data from Strapi collection: ${collectionName}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetadata();
    fetchData();
  }, [collectionName]);

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setFormError(null);
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedRecord({});
    setIsAddModalOpen(true);
    setFormError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedRecord(null);
    setFormError(null);
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`http://${strapiHost}:${strapiPort}/api/${collectionName}/${id}`, {
        headers,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting record");
    }
  };

  const handleSave = async (values, { setSubmitting }) => {
    try {
      // Strip built-in fields from the values before sending
      const filteredValues = Object.keys(values).reduce((acc, key) => {
        // Add only if it's not a built-in Strapi field
        if (!['id', 'createdAt', 'updatedAt', 'publishedAt','documentId'].includes(key)) {
          acc[key] = values[key];
        }
        return acc;
      }, {});
  
      const endpoint = selectedRecord.id
        ? `http://${strapiHost}:${strapiPort}/api/${collectionName}/${values.documentId}`
        : `http://${strapiHost}:${strapiPort}/api/${collectionName}`;
      const method = selectedRecord.id ? "put" : "post";
  
      console.log(`Saving: ${JSON.stringify(filteredValues)}`);
  
      await axios({
        method,
        url: endpoint,
        data: { data: filteredValues },
        headers: {
          Authorization: `Bearer ${strapiApiKey}`,
          "Content-Type": "application/json",
        },
      });
  
      fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving record:", error);
      setFormError("An error occurred while saving the record. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const buildValidationSchema = () => {
    const validationSchema = {};
    metadata.forEach((field) => {
      if (field.fieldName === "documentId") {
        return;
      }
      
      let validator;

      const fieldType = field?.type || "string";

      if (fieldType === "number" || fieldType === "integer" || fieldType === "decimal") {
        validator = Yup.number();
        if (field.min !== undefined) validator = validator.min(field.min);
        if (field.max !== undefined) validator = validator.max(field.max);
      } else if (fieldType === "string") {
        validator = Yup.string();
        if (field.minLength) validator = validator.min(field.minLength);
        if (field.maxLength) validator = validator.max(field.maxLength);
      } else if (fieldType === "date") {
        validator = Yup.date();
      } else if (fieldType === "email") {
        validator = Yup.string().email();
      }
      else {
        // if unknown field type return
        return;
      }

      if (field?.required) {
        validator = validator.required("This field is required");
      }

      validationSchema[field.fieldName] = validator || Yup.mixed();
    });

    return Yup.object().shape(validationSchema);
  };

  const handleFilterChange = (e) => {
    setFilterInput(e.target.value);
  };

  const filteredData = useMemo(() => {
    if (!filterInput) return data;
    return data.filter((row) =>
      Object.values(row).some(
        (val) => val && val.toString().toLowerCase().includes(filterInput.toLowerCase())
      )
    );
  }, [data, filterInput]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: page, pageSize: rowsPerPage },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <TextField
              label="Search"
              value={filterInput}
              onChange={handleFilterChange}
              variant="outlined"
              style={{ width: "80%" }}
              margin="normal"
            />
            <IconButton
              onClick={openAddModal}
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                marginLeft: "8px",
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table {...getTableProps()}>
              <TableHead>
                {headerGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          textAlign: column.id === "actions" ? "right" : "left",
                        }}
                      >
                        {column.render("Header")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getTableBodyProps()}>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  prepareRow(row);
                  return (
                    <TableRow {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <TableCell {...cell.getCellProps()}>
                          {typeof cell.value === "boolean" ? (
                            cell.value ? <CheckIcon color="success" /> : <CloseIcon color="error" />
                          ) : (
                            cell.render("Cell")
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
          {/* Edit/Add Modal */}
          <Modal isOpen={isModalOpen || isAddModalOpen} onRequestClose={closeModal} style={customStyles}>
            <h2>{isAddModalOpen ? "Add Record" : "Edit Record"}</h2>
            {selectedRecord && (
              <Formik
                initialValues={selectedRecord}
                validationSchema={buildValidationSchema()}
                onSubmit={handleSave}
              >
                {({ values, handleChange, isSubmitting }) => (
                  <Form>
                    {metadata.map((field) => (
                        (field.fieldName !== "documentId") && ( 
                        <div key={field.fieldName} style={{ marginBottom: "16px" }}>
                        <label>{field.fieldName}</label>
                        {!field.columnIsEditable ? (
                          field.type === "json" ? <div>{JSON.stringify(values[field.fieldName])}</div> : <div>{values[field.fieldName]}</div>
                        ) : (
                          <>
                            {((field.type === "number") || (field.type === "integer") || (field.type === "decimal")) ? (
                              <TextField
                                name={field.fieldName}
                                type="number"
                                value={values[field.fieldName] || ""}
                                onChange={handleChange}
                                fullWidth
                              />
                            ) : field.type === "boolean" ? (
                              <Checkbox
                                name={field.fieldName}
                                checked={values[field.fieldName] || false}
                                onChange={(e) =>
                                  handleChange({
                                    target: {
                                      name: field.fieldName,
                                      value: e.target.checked,
                                    },
                                  })
                                }
                              />
                            ) : field.type === "enumeration" && field.enum ? (
                              <FormControl fullWidth>
                                <Select
                                  name={field.fieldName}
                                  value={values[field.fieldName] || ""}
                                  onChange={handleChange}
                                >
                                  {field.enum.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            ) : field.type === "date" ? (
                              <TextField
                                name={field.fieldName}
                                type="date"
                                value={values[field.fieldName] || ""}
                                onChange={handleChange}
                                fullWidth
                              />
                            ) : field.type === "json" ? (
                              <TextField
                                name={field.fieldName}
                                type="text"
                                value={JSON.stringify(values[field.fieldName]) || ""}
                                onChange={handleChange}
                                fullWidth
                              />
                            ) : (
                              // Default case for any other type or if no type is defined
                              <TextField
                                name={field.fieldName}
                                type="text"
                                value={values[field.fieldName] || ""}
                                onChange={handleChange}
                                fullWidth
                              />
                            )}
                          </>
                        )}
                        <ErrorMessage name={field.fieldName} component="div" style={{ color: 'red' }} />
                      </div>
                    )))}
                    {formError && <Alert severity="error">{formError}</Alert>}
                    <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                      <IconButton type="submit" color="primary" disabled={isSubmitting}>
                        <SaveIcon />
                      </IconButton>
                      <IconButton type="button" onClick={closeModal} color="secondary">
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
          </Modal>

          {/* View Modal */}
          <Modal isOpen={isViewModalOpen} onRequestClose={closeModal} style={customStyles}>
            <h2>View Record</h2>
            {selectedRecord && (
              <div>
                {metadata.map((field) => (
                   field.fieldName !== "documentId" && ( 
                  <div key={field.fieldName} style={{ marginBottom: "16px" }}>
                    <strong>{field.fieldName}:</strong> {
                    field.type === "json" ? JSON.stringify(selectedRecord[field.fieldName]) : selectedRecord[field.fieldName]?.toString() }
                  </div>
                )))}
                <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                  <IconButton onClick={closeModal} color="secondary">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default StrapiTable;
