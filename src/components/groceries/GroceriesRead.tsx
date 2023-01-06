import { Box } from "@mui/material";
import GroceriesReadCategory from "./GroceriesReadCategory";

export type GroceriesReadProps = {};

export default function GroceriesRead(props: GroceriesReadProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <GroceriesReadCategory category="Produce" />
      <GroceriesReadCategory category="Protein" />
    </Box>
  );
}
