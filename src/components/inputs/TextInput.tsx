import {
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
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
        <FormControl
          variant="filled"
          error={item.fieldState.error != null}
          fullWidth
        >
          <InputLabel
            htmlFor="component-error"
            shrink={props.type === "date" ? true : undefined}
          >
            {props.label}
          </InputLabel>
          <FilledInput
            id={props.name}
            value={item.field.value}
            type={props.type ?? "text"}
            multiline={props.multiline}
            rows={props.rows}
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
