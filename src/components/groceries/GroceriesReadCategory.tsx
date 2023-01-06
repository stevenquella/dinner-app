import { Box, Chip, Typography } from "@mui/material";

export type GroceriesReadCategoryProps = {
  category: string;
  groceries?: string[];
};

export default function GroceriesReadCategory(
  props: GroceriesReadCategoryProps
) {
  return (
    <Box>
      <Typography variant="caption" fontWeight="medium">
        {props.category}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        <Chip label="TEST (5)" />
        <Chip label="TEST" />
        <Chip label="TEST" />
        <Chip label="TEST" />
      </Box>
    </Box>
  );
}
