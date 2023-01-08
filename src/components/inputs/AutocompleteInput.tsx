import { Autocomplete, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { InputValidation } from "./types";

export type AutocompleteInputProps = {
  name: string;
  label: string;
  options: string[];
  rules?: InputValidation;
};

export default function AutocompleteInput(props: AutocompleteInputProps) {
  return (
    <Controller
      name={props.name}
      rules={props.rules}
      render={(item) => (
        <Autocomplete
          freeSolo
          options={props.options}
          onChange={(_, data) => item.field.onChange(data)}
          onBlur={item.field.onBlur}
          value={item.field.value}
          renderInput={(params) => (
            <TextField
              {...params}
              {...item.field}
              fullWidth
              inputRef={item.field.ref}
              variant="filled"
              label={props.label}
              error={item.fieldState.error != null}
              helperText={item.fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
}
