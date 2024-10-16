import React, { useState, useEffect } from 'react';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import { fetchRecords, addRecord, deleteRecord } from '../api/recordApi'; 
import * as Yup from 'yup';
import {
  Button,
  TextField,
  Box,
  MenuItem,
  IconButton,
  Typography,
  Container,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

const fieldTypes = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' }
];

// Validation options for different field types
const validationOptions = {
  string: [
    { value: 'required', label: 'Required', needsValue: false },
    { value: 'minLength', label: 'Min Length', needsValue: true },
    { value: 'maxLength', label: 'Max Length', needsValue: true },
    { value: 'pattern', label: 'Pattern', needsValue: true }
  ],
  number: [
    { value: 'required', label: 'Required', needsValue: false },
    { value: 'min', label: 'Min Value', needsValue: true },
    { value: 'max', label: 'Max Value', needsValue: true }
  ],
  boolean: [
    { value: 'required', label: 'Required', needsValue: false }
  ],
  date: [
    { value: 'required', label: 'Required', needsValue: false },
    { value: 'min', label: 'Min Date', needsValue: true },
    { value: 'max', label: 'Max Date', needsValue: true }
  ],
  email: [
    { value: 'required', label: 'Required', needsValue: false },
    { value: 'pattern', label: 'Pattern (Email Format)', needsValue: true }
  ]
};

const RecordForm = ({ onSubmit }) => {
  const [records, setRecords] = useState([]);
  const fetchRecordsFromApi = async () => {
    try {
      const response = await fetchRecords();
      setRecords(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setRecords([]);
    }
  };
  useEffect(() => {
    fetchRecordsFromApi();
  }, []);

  const handleDeleteRecord = async (id) => {
    try {
      await deleteRecord(id);  
      fetchRecordsFromApi(); 
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      tableName: '',
      fields: [{ name: '', type: '', validation: [] }],
    },
    validationSchema: Yup.object({
      tableName: Yup.string().required('Table name is required'),
      fields: Yup.array().of(
        Yup.object({
          name: Yup.string().required('Field name is required'),
          type: Yup.string().required('Field type is required'),
          validation: Yup.array().of(
            Yup.object({
              rule: Yup.string().required('Validation rule is required'),
              value: Yup.string() // Optional: Add further validation for the values
            })
          )
        })
      ),
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values));
    },
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Create a Record Model</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Table Name"
              name="tableName"
              value={formik.values.tableName}
              onChange={formik.handleChange}
              error={formik.touched.tableName && Boolean(formik.errors.tableName)}
              helperText={formik.touched.tableName && formik.errors.tableName}
            />
          </Grid>
        </Grid>

        <FormikProvider value={formik}>
          <FieldArray name="fields">
            {({ push, remove }) => (
              <div>
                {formik.values.fields.map((field, index) => (
                  <Box key={index} display="flex" alignItems="center" my={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Field Name"
                          name={`fields[${index}].name`}
                          value={field.name}
                          onChange={formik.handleChange}
                          error={formik.touched.fields?.[index]?.name && Boolean(formik.errors.fields?.[index]?.name)}
                          helperText={formik.touched.fields?.[index]?.name && formik.errors.fields?.[index]?.name}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          select
                          fullWidth
                          label="Field Type"
                          name={`fields[${index}].type`}
                          value={field.type}
                          onChange={formik.handleChange}
                          error={formik.touched.fields?.[index]?.type && Boolean(formik.errors.fields?.[index]?.type)}
                          helperText={formik.touched.fields?.[index]?.type && formik.errors.fields?.[index]?.type}
                        >
                          {fieldTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography>Validation Options</Typography>
                        <FormGroup>
                          {validationOptions[field.type]?.map((option) => (
                            <div key={option.value}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formik.values.fields[index].validation.some(
                                      (v) => v.rule === option.value
                                    )}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      const validation = formik.values.fields[index].validation;

                                      if (isChecked) {
                                        formik.setFieldValue(
                                          `fields[${index}].validation`,
                                          [
                                            ...validation,
                                            { rule: option.value, value: '', needsValue: option.needsValue }
                                          ]
                                        );
                                      } else {
                                        formik.setFieldValue(
                                          `fields[${index}].validation`,
                                          validation.filter((v) => v.rule !== option.value)
                                        );
                                      }
                                    }}
                                  />
                                }
                                label={option.label}
                              />
                              {formik.values.fields[index].validation.some((v) => v.rule === option.value) &&
                                option.needsValue && (
                                  <TextField
                                    fullWidth
                                    label={`${option.label} Value`}
                                    name={`fields[${index}].validation[${formik.values.fields[index].validation.findIndex(
                                      (v) => v.rule === option.value
                                    )}].value`}
                                    value={
                                      formik.values.fields[index].validation.find(
                                        (v) => v.rule === option.value
                                      ).value
                                    }
                                    onChange={formik.handleChange}
                                    error={
                                      formik.touched.fields?.[index]?.validation?.find(
                                        (v) => v.rule === option.value
                                      )?.value &&
                                      Boolean(
                                        formik.errors.fields?.[index]?.validation?.find(
                                          (v) => v.rule === option.value
                                        )?.value
                                      )
                                    }
                                    helperText={
                                      formik.touched.fields?.[index]?.validation?.find(
                                        (v) => v.rule === option.value
                                      )?.value &&
                                      formik.errors.fields?.[index]?.validation?.find(
                                        (v) => v.rule === option.value
                                      )?.value
                                    }
                                  />
                                )}
                            </div>
                          ))}
                        </FormGroup>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => remove(index)}>
                          <RemoveCircle color="error" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => push({ name: '', type: '', validation: [] })}
                  startIcon={<AddCircle />}
                >
                  Add Field
                </Button>
              </div>
            )}
          </FieldArray>
        </FormikProvider>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Save Model
        </Button>
      </form>
    </Container>
  );
};

export default RecordForm;
