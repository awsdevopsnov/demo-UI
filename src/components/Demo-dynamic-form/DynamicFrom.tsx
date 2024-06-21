import { Grid } from "@mui/material";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import TextFieldUi from "../ui/TextField";
import ButtonSmallUi from "../ui/ButtonSmall";
import SelectDropdown from "../ui/SelectDropdown";
import DatePickerUi from "../ui/DatePicker";
import RadioUi from "../ui/RadioGroup";

type FormFieldProps = {
  [key: string]: string;
};

interface FieldConfig {
  name: string;
  placeholder: string;
  type: any;
  options?: { value: string; label: string }[];
  subFields?: any;

}

interface FormConfig {
  fields: FieldConfig[];
}

const FormField = ({ updateFormValue, setFormData }: any) => {
  const { setFieldValue, values } = useFormikContext<FormFieldProps>();

  useEffect(() => {
    if (values) {
      setFormData(values);
    }
  }, [values, setFormData]);

  useEffect(() => {
    updateFormValue(setFieldValue);
  }, [updateFormValue, setFieldValue]);

  return (
    <div>
      <Grid container>
        <FormFields />
        <ButtonSmallUi label="Submit" type="submit" />
      </Grid>
    </div>
  );
};

const FormFields = () => {
  const formConfig: FormConfig = {
    fields: [
      { name: "firstName", placeholder: "First Name", type: "text" },
      {
        name: "gender",
        placeholder: "Gender",
        type: "select",
        options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "color",
        placeholder: "Color",
        type: "radio",
        options: [
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
        ],
      },
    ],

  };

  return (
    <>
      {formConfig.fields.map((field, index) => {
        if (field.type === "text") {
          return <TextFieldRenderer key={index} field={field} />;
        } else if (field.type === "select") {
          return <DropdownFieldRenderer key={index} field={field} />;
        } else if (field.type === "date") {
          return <DateFieldRenderer key={index} field={field} />;
        } else if (field.type === "radio") {
          return <RadioFieldRenderer key={index} field={field} />;
        } else {
          return null;
        }
      })}

    </>
  );
};

interface FieldRendererProps {
  field: FieldConfig;
}

const DropdownFieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  const { values, setFieldValue } = useFormikContext<FormFieldProps>();

  const handleChange = (selectedValue: any | null) => {
    if (selectedValue) {
      setFieldValue(`${field.name}`, selectedValue.value);
    } else {
      setFieldValue(field.name, null);
    }
  };

  return (
    <Grid item xs={6}>
      <SelectDropdown
        onChange={handleChange}
        options={field.options || []}
        value={values[field.name] ? { value: values[field.name], label: values[field.name] } : null}
        labelText={field.placeholder} // Use placeholder as labelText
      />
    </Grid>
  );
};

const TextFieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  const { values, setFieldValue } = useFormikContext<FormFieldProps>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      setFieldValue(field.name, e.target.value);
    } else {
      setFieldValue(field.name, null);
    }

  };

  return (
    <Grid item xs={6}>
      <TextFieldUi
        type={field.type}
        label={field.placeholder}
        name={field.name}
        value={values[field.name] || ""}
        onChange={handleChange}
      />
    </Grid>
  );
};

const DateFieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  const { values, setFieldValue } = useFormikContext<FormFieldProps>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(field.name, e);
  };

  return (
    <Grid item xs={6}>
      <DatePickerUi
        label={field.placeholder}
        value={values[field.name]}
        onChange={handleChange}
      />
    </Grid>
  );
};

const RadioFieldRenderer: React.FC<FieldRendererProps> = ({ field }) => {
  const { values, setFieldValue } = useFormikContext<FormFieldProps>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(field.name, e.target.value);
  };

  return (
    <Grid item xs={6}>
      <RadioUi
        options={field.options || []} value={values[field.name]} onChange={handleChange}
      />
    </Grid>
  );
};

const DynamicForm = () => {
  const [formValues, setFormValues] = useState<any>({
    firstName: "",
    gender: "",
    color: "",
  });
  const [formData, setFormData] = useState<FormFieldProps | undefined>();

  const updateFormValue = (setFieldValue: Function) => {
    if (formValues.firstName === "arun") {
      setFieldValue("address.addressOne", "newAddress");
    }
  };

  return (
    <div>
      <h1>{"Formik Context"}</h1>
      <Formik
        onSubmit={async (values) => {
        }}
        initialValues={formValues}
      >
        <Form>
          <FormField setFormData={setFormData} updateFormValue={updateFormValue} />
        </Form>
      </Formik>
    </div>
  );
};

export default DynamicForm;
