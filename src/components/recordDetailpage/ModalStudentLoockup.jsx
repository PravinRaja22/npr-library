import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, MenuItem,Autocomplete ,TextField} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'




const url = `http://localhost:4500/getSingleStudent`;
const fetchStudentsbyName ='http://localhost:4500/lookupStudent'

const ModalStudentLoockup = ({ data,handleModal }) => {

    const [parentRecord, setParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    const[studentRecord,setStudentRecord]=useState([])
   
    useEffect(() => {
        console.log('passed record Modal Page',data);
         setParentRecord(data);     
        fetchStudentRecord('')
        getRelatedRecord() 
    }, [])

    const initialValues = {
      relatedField:'',
    }


   
    const validationSchema = Yup.object({
        // relatedField: Yup
        //     .string()
        //     .required('Required')
    })

    const getRelatedRecord=()=>{
        console.log('getRelatedRecord',getRelatedRecord)
        axios.post(url , parentRecord._id)
        .then(res=>{
            console.log('inside use effect',res)

        })
        .catch(err=>{
            console.log('use effect err',err);
        })
    }

    const formSubmission = (values) => {
   
        console.log('form submission value',values);

         delete values.relatedField;
        // values.studentRecordId=values.relatedField._id;
        // values.StudnetName=values.relatedField.StudnetRollNo;
        values.bookName =parentRecord.BookName
        values.bookRecordId=parentRecord._id;
        console.log('after  submission value',values);

        axios.post(url, values)
        .then((res) => {
            console.log('upsert record  response', res);
           
            setTimeout(() => {
                handleModal();
            }, 1000)
        })
        .catch((error) => {
            console.log('upsert record  error', error);
           
              setTimeout(() => {
                handleModal();
            }, 1000)
        })
    }

    const fetchStudentRecord=(newInputValue)=>{
        axios.post(`${fetchStudentsbyName}?searchKey=${newInputValue}`)
        .then((res) => {
           console.log(res)
                setStudentRecord(res.data)
        })
        .catch((error) => {
            console.log('error fetchStudentsbyName', error);
        })
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Issue Book</h3> 
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
                >
                    {(props) => {
                        const {
                            values,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleSubmit,
                            handleReset,
                            setFieldValue,
                        } = props;

                        return (
                            <>
                                
                              
                                <Form>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="relatedField">   Student Name <span className="text-danger">*</span></label>
                                            <Autocomplete
                                                name="relatedField"
                                                className='form-customSelect'
                                                options={studentRecord}
                                                value={values.relatedField}
                                                getOptionLabel={option => option.studentName || ''}
                                                onChange={(e, value) => {
                                                console.log('autocomplete onchange ',value)
                                                    if(!value){                                
                                                        console.log('!value',value);
                                                        setFieldValue("studentRecordId",'')
                                                        setFieldValue("studentName",'')
                                                        setFieldValue("relatedField",'')
                                                      }else{
                                                        console.log('value',value);
                                                        setFieldValue("studentRecordId",value.id)
                                                        setFieldValue("studentName",value.studentName)
                                                        setFieldValue("relatedField",value)
                                                      }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('onInputChange entered value', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        fetchStudentRecord(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        fetchStudentRecord(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="relatedField"  required/>
                                                )}
                                            />

                                        </Grid>
                                        
                                    </Grid>

                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>

                                            <Button type="reset" variant="contained" onClick={handleModal}  >Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Grid>
    )
}

export default ModalStudentLoockup;
