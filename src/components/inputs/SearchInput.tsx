import { TextField } from "@mui/material";
import debounce from "lodash.debounce";
import { useMemo } from "react";

export type SearchInputProps = {
  name: string;
  placeholder: string;
  defaultValue: string;
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
      type="search"
      placeholder="Search meals..."
      defaultValue={props.defaultValue}
      onChange={debouncedChangeHandler}
      fullWidth
      sx={{ bgcolor: "background.paper", mt: 2 }}
    />
  );
}
