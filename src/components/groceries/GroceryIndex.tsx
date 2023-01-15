import { Flatware } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Grocery } from "../../providers/provider.types";
import { useGroceries } from "../../providers/providerGrocery";
import HighlightText from "../items/HighlightText";
import { MealsRelated } from "../meals/MealsRelated";
import Page from "../Page";
import GroceryEdit from "./GroceryEdit";

export default function GroceryIndex() {
  const groceries = useGroceries();
  const [createGrocery, setCreateGrocery] = useState<boolean>(false);
  const [selectedGrocery, setSelectedGrocery] = useState<Grocery>();

  return (
    <Page {...groceries}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">Groceries</Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => setCreateGrocery(true)}
        >
          Create Groceries
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {groceries.data?.map((grocery) => (
          <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
            <CardActionArea onClick={() => setSelectedGrocery(grocery)}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1" flexGrow={1}>
                    <HighlightText text={grocery.name} search={""} />
                  </Typography>
                  {grocery.meal_grocery.length > 0 ? (
                    <Chip
                      icon={<Flatware />}
                      label={grocery.meal_grocery.length}
                      variant="outlined"
                    />
                  ) : null}
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      {groceries.data?.length === 0 ? (
        <Typography variant="body1">No groceries found.</Typography>
      ) : (
        <span></span>
      )}

      <GroceryEdit
        open={createGrocery}
        onDismiss={() => setCreateGrocery(false)}
        onAddGrocery={() => {}}
      />
      <Dialog
        keepMounted
        maxWidth="sm"
        fullWidth={true}
        open={!!selectedGrocery}
      >
        <DialogTitle>{selectedGrocery?.name}</DialogTitle>
        <DialogContent>
          <MealsRelated
            ids={selectedGrocery?.meal_grocery.map((x) => x.meal_id)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={() => setSelectedGrocery(undefined)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
