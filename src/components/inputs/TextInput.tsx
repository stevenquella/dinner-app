import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import { Controller } from "react-hook-form";

export type TextInputProps = {
  name: string;
  label: string;
  type: string;
  autocomplete: string;
  rules?: InputValidation;
};

export type InputValidation = {
  required?: {
    value: boolean;
    message: string;
  };
};

export default function TextInput(props: TextInputProps) {
  return (
    <Controller
      name={props.name}
      rules={props.rules}
      render={(item) => (
        <FormControl
          variant="standard"
          error={item.fieldState.error != null}
          fullWidth
        >
          <InputLabel htmlFor="component-error">{props.label}</InputLabel>
          <Input
            id={props.name}
            value={item.field.value}
            type={props.type}
            autoComplete={props.autocomplete}
            onChange={item.field.onChange}
            onBlur={item.field.onBlur}
          />
          {item.fieldState.error != null ? (
            <FormHelperText>{item.fieldState.error?.message}</FormHelperText>
          ) : (
            <span></span>
          )}
        </FormControl>
      )}
    />
  );
}
