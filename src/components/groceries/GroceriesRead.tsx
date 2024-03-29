import { Box, Chip, Typography } from "@mui/material";
import { Grocery } from "../../providers/provider.types";
import { getGroceriesById, groceryCategories } from "../../providers/providerGrocery";

export type GroceriesReadProps = {
  groceries?: Grocery[];
  ids?: string[];
  showCount?: boolean;
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
            showCount={props.showCount ?? false}
          />
        );
      })}
    </Box>
  );
}

type GroceriesReadCategoryProps = {
  category: string;
  groceries?: Grocery[];
  showCount: boolean;
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
        {props.groceries?.map((g) => {
          const name = props.showCount ? `${g.name} (${g.meal_grocery.length})` : g.name;
          return <Chip key={g.id} label={name} onDelete={handleDelete(g.id)} />;
        })}
      </Box>
    </Box>
  );
}
