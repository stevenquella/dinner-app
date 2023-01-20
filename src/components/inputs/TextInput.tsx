import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { InputValidation } from "./types";

export type TextInputProps = {
  name: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  autocomplete?: string;
  rules?: InputValidation;
};

export default function TextInput(props: TextInputProps) {
  return (
    <Controller
      name={props.name}
      rules={props.rules}
      render={(item) => (
        <TextField
          name={props.name}
          variant="filled"
          type={props.type ?? "text"}
          label={props.label}
          multiline={props.multiline}
          rows={props.rows}
          autoComplete={props.autocomplete}
          value={item.field.value}
          onChange={item.field.onChange}
          onBlur={item.field.onBlur}
          InputLabelProps={{ shrink: props.type === "date" ? true : undefined }}
          error={!!item.fieldState.error}
          helperText={item.fieldState.error?.message}
        />
      )}
    />
  );
}
