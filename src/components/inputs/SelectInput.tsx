import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { InputValidation } from "./types";

export type TextInputProps = {
  name: string;
  label: string;
  rules?: InputValidation;

  values: {
    value?: number | string;
    text: string;
  }[];
};

export default function SelectInput(props: TextInputProps) {
  return (
    <Controller
      name={props.name}
      rules={props.rules}
      render={(item) => (
        <FormControl fullWidth>
          <InputLabel variant="filled">{props.label}</InputLabel>
          <Select
            id={props.name}
            label={props.label}
            variant="filled"
            value={item.field.value}
            onChange={item.field.onChange}
            onBlur={item.field.onBlur}
          >
            {props.values.map((x, i) => (
              <MenuItem key={i} value={x.value}>
                {x.text}
              </MenuItem>
            ))}
          </Select>
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
