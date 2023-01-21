import { Flatware } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardContent, Chip, Link, Typography } from "@mui/material";
import { atom, useAtom } from "jotai";
import { Link as RouterLink, Outlet } from "react-router-dom";
import { useGroceries } from "../../providers/providerGrocery";
import HighlightText from "../items/HighlightText";
import Page from "../Page";

const showIncrement = 50;
const groceriesShownAtom = atom<number>(showIncrement);

export default function GroceryIndex() {
  const groceries = useGroceries();
  const [shownCount, setShownCount] = useAtom(groceriesShownAtom);
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
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
        {groceries.data?.slice(0, shownCount).map((grocery) => (
          <Link key={grocery.id} component={RouterLink} to={grocery.id} underline="none">
            <Card sx={{ borderBottom: 1, borderColor: "divider" }}>
              <CardActionArea>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" flexGrow={1}>
                      <HighlightText text={grocery.name} search={""} />
                    </Typography>
                    {grocery.meal_grocery.length > 0 ? (
                      <Chip icon={<Flatware />} label={grocery.meal_grocery.length} variant="outlined" />
                    ) : null}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </Box>
      {groceries.data?.length === 0 ? <Typography variant="body1">No groceries found.</Typography> : <span></span>}
      {shownCount < (groceries.data?.length ?? 0) ? (
        <Button color="secondary" sx={{ mt: 1 }} onClick={() => setShownCount(shownCount + showIncrement)}>
          Show More
        </Button>
      ) : (
        <span></span>
      )}

      <Outlet />
    </Page>
  );
}
