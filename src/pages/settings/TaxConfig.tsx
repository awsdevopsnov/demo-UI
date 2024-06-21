import { useState } from 'react'
import { Box, Grid, } from '@mui/material';
import { Formik, Form } from 'formik';
import ToastUi from '../../components/ui/ToastifyUi';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { invoiceCreateInitialValue } from '../../constants/forms/formikInitialValues';
import { InvoiceInitialValueProps } from '../../types/types';
import { generateOptions } from '../../services/utils/dropdownOptions';
import InvoiceUi from '../../components/Generate-Invoice/InvoiceUi';
import { useGetGstTypeQuery } from '../../redux-store/invoice/gstTypeApi';
import { useGetTdsTaxQuery } from '../../redux-store/invoice/tdsTaxApi';
import { useGetPaymentTermsQuery } from '../../redux-store/invoice/paymentTerms';
import { addDays, format } from 'date-fns';
import DialogBoxUi from '../../components/ui/DialogBox';
import GstTypeScreen from '../Invoice/GstType/GstTypeScreen';
import PaymentTermsScreen from '../Invoice/paymentTerms/PaymentTermsScreen';
import TdsTaxScreen from '../Invoice/TdsTax/TdsTaxScreen';
import ServiceScreen from '../Invoice/service/ServiceScreen';


const TaxConfig = () => {
    const [popUpComponent, setPopUpComponent] = useState("");
    const [opendialogBox, setIsOpenDialogBox] = useState(false);
    // * * * * * * * grid table states * * * * * * * * *
    const { data: paymentTerms } = useGetPaymentTermsQuery();
    const [invoiceValues, setInvoiceValues] = useState(invoiceCreateInitialValue);
    const { data: gstTypesData = [] } = useGetGstTypeQuery();
    const { data: tdsTaxData = [] } = useGetTdsTaxQuery();

    // * ----------- to generate the dropdown options -------------
    const gstTypeOptions = generateOptions(gstTypesData, "gstName", "gstName");
    const tdsTaxOptions = generateOptions(tdsTaxData, "taxName", "taxName");
    const paymentTermsOptions = generateOptions(paymentTerms, "termName", "termName");

    const PopupComponents = {
        GST_TYPE: 'gstType',
        PAYMENT_TERMS: 'paymentTerms',
        TDS_TAX: 'tdsTax',
        SERVICES: 'services',
        INVOICE: 'invoice'
    }

    return (
        <Formik
            initialValues={invoiceValues}
            // validationSchema={invoiceValidationSchema}
            validate={() => ({})}
            onSubmit={async (values: InvoiceInitialValueProps, { setSubmitting, resetForm }) => {
                try {
                    console.log(values);

                    resetForm();
                    setInvoiceValues({ ...invoiceValues })
                } catch (error) {
                    console.error("An error occurred during login:", error);
                }
                finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, touched, values, handleChange, handleSubmit, setFieldValue }) => {
                return (
                    <div>
                        <ToastUi autoClose={2000} />

                        {/* ---------- payment Terms, gst type, tds tax screens ---------- */}
                        <DialogBoxUi
                            open={opendialogBox}
                            content={
                                <>
                                    {
                                        popUpComponent === PopupComponents.GST_TYPE ? <GstTypeScreen /> :
                                            popUpComponent === PopupComponents.PAYMENT_TERMS ? <PaymentTermsScreen /> :
                                                popUpComponent === PopupComponents.TDS_TAX ? <TdsTaxScreen /> :
                                                    popUpComponent === PopupComponents.SERVICES ? <ServiceScreen /> :
                                                        popUpComponent === PopupComponents.INVOICE ? <InvoiceUi /> : null
                                    }
                                </>
                            }

                            handleClose={() => {
                                setIsOpenDialogBox(false)
                                setPopUpComponent("")

                            }}
                        />
                        <Form id="createClientForm" noValidate >
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Box>
                                        <SelectDropdown
                                            onMouseDown={() => {
                                                setIsOpenDialogBox(true)
                                                setPopUpComponent(PopupComponents.GST_TYPE)
                                            }}
                                            button={true}
                                            onChange={(newValue: any) => {
                                                if (newValue) {
                                                    const selectedGstType = gstTypesData.find((item) => item.gstName === newValue.value)
                                                    if (selectedGstType) {
                                                        setFieldValue("gstPercentage", selectedGstType.gstPercentage)
                                                        setFieldValue("gstType", newValue.value)
                                                    } else {
                                                        setFieldValue("gstType", "")
                                                        setFieldValue("gstPercentage", null)
                                                    }
                                                } else {
                                                    setFieldValue("gstType", "")
                                                    setFieldValue("gstPercentage", null)
                                                }
                                            }}
                                            options={gstTypeOptions}
                                            value={values.gstType ? { value: values.gstType, label: values.gstType } : null}
                                            labelText='Gst Type'
                                            error={touched.gstType && Boolean(errors.gstType)}
                                            helperText={touched.gstType && errors.gstType}
                                        />
                                    </Box>
                                </Grid>


                                <Grid item xs={3}>
                                    <Box>
                                        <SelectDropdown
                                            button={true}
                                            onMouseDown={() => {
                                                setPopUpComponent(PopupComponents.PAYMENT_TERMS);
                                                setIsOpenDialogBox(true)
                                            }}
                                            onChange={(newValue: any) => {
                                                if (newValue) {
                                                    const selectedPaymentTerms = paymentTerms?.find((item) => item.termName === newValue.value)
                                                    if (selectedPaymentTerms) {
                                                        const today = new Date();
                                                        const startDate = format(today, 'dd-MM-yyyy');
                                                        const dueDate = format(addDays(today, selectedPaymentTerms.totalDays), 'dd-MM-yyyy')
                                                        setFieldValue("startDate", startDate)
                                                        setFieldValue("dueDate", dueDate)
                                                        setFieldValue("paymentTerms", newValue.value)
                                                    } else {
                                                        setFieldValue("startDate", "")
                                                        setFieldValue("dueDate", "")
                                                    }
                                                } else {
                                                    setFieldValue("paymentTerms", "")
                                                    setFieldValue("startDate", "")
                                                    setFieldValue("dueDate", "")
                                                }
                                            }}
                                            options={paymentTermsOptions}
                                            value={values.paymentTerms ? { value: values.paymentTerms, label: values.paymentTerms } : null}
                                            labelText='Payment Terms'
                                            error={touched.paymentTerms && Boolean(errors.paymentTerms)}
                                            helperText={touched.paymentTerms && errors.paymentTerms}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: "flex" }} >
                                        <SelectDropdown
                                            onMouseDown={() => {
                                                setIsOpenDialogBox(true)
                                                setPopUpComponent(PopupComponents.TDS_TAX)
                                                // navigate("/customer/create")
                                            }}
                                            button={true}
                                            width='150px'
                                            onChange={(newValue: any) => {
                                                if (newValue) {
                                                    const selectedTdsTax = tdsTaxData.find((item) => item.taxName === newValue.value);
                                                    if (selectedTdsTax) {
                                                        setFieldValue("taxAmount.tds", newValue.value)
                                                    } else {
                                                        setFieldValue("taxAmount.tds", "")
                                                    }
                                                }
                                                else {
                                                    setFieldValue("taxAmount.tds", "")
                                                }
                                            }}
                                            options={tdsTaxOptions}
                                            value={values.taxAmount.tds ? { value: values.taxAmount.tds, label: values.taxAmount.tds } : null}
                                            labelText='TDS %'
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Form>
                    </div>
                )
            }
            }
        </Formik >
    )
}

export default TaxConfig