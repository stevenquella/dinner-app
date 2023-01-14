import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import { useGroceries } from "../../providers/providerGrocery";
import HighlightText from "../items/HighlightText";
import Page from "../Page";

export default function GroceryIndex() {
  const groceries = useGroceries();

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
        <Button variant="contained" size="small">
          Create Groceries
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {groceries.data?.map((grocery) => (
          <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
            <CardActionArea>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1" flexGrow={1}>
                    <HighlightText text={grocery.name} search={""} />
                  </Typography>
                  {grocery.meal_grocery.length > 0 ? (
                    <Chip label={grocery.meal_grocery.length} />
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
    </Page>
  );
}
