import { Box, Chip, Typography } from "@mui/material";
import {
  getGroceriesById,
  Grocery,
  groceryCategories,
} from "../../providers/providerGrocery";

export type GroceriesReadProps = {
  groceries?: Grocery[];
  ids: string[];
  onDelete?: (id: string) => void;
};

export default function GroceriesRead(props: GroceriesReadProps) {
  const models = getGroceriesById(props.groceries, props.ids);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {groceryCategories.map((category) => {
        const byCategory = models.filter((x) => x.category === category);
        if (byCategory.length === 0) {
          return null;
        }

        return (
          <GroceriesReadCategory
            key={category}
            category={category}
            groceries={byCategory}
            onDelete={props.onDelete}
          />
        );
      })}
    </Box>
  );
}

type GroceriesReadCategoryProps = {
  category: string;
  groceries?: Grocery[];
  onDelete?: (id: string) => void;
};

function GroceriesReadCategory(props: GroceriesReadCategoryProps) {
  const handleDelete = (id: string) => {
    if (props.onDelete) {
      return () => props.onDelete?.(id);
    }
  };

  return (
    <Box>
      <Typography variant="caption" fontWeight="medium">
        {props.category}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
        {props.groceries?.map((g) => (
          <Chip key={g.id} label={g.name} onDelete={handleDelete(g.id)} />
        ))}
      </Box>
    </Box>
  );
}
