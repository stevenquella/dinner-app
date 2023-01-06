import { TextField } from "@mui/material";
import debounce from "lodash.debounce";
import { useMemo } from "react";

export type SearchInputProps = {
  name: string;
  placeholder?: string;
  defaultValue: string;
  label?: string;
  type?: string;
  onChange: (val: string) => void;
};

export default function SearchInput(props: SearchInputProps) {
  const debouncedChangeHandler = useMemo(() => {
    const changeHandler = (event: { target: { value: string } }) => {
      props.onChange(event.target.value);
    };

    return debounce(changeHandler, 300);
  }, [props]);

  return (
    <TextField
      variant="outlined"
      size="small"
      type={props.type ?? "search"}
      label={props.label}
      placeholder="Search meals..."
      defaultValue={props.defaultValue}
      onChange={debouncedChangeHandler}
      fullWidth
      sx={{ bgcolor: "background.paper", mt: 2 }}
      InputLabelProps={{ shrink: props.type === "date" ? true : undefined }}
    />
  );
}
