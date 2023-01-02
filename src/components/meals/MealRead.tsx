import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { atom, useAtom, useSetAtom } from "jotai";
import { atomsWithQuery } from "jotai-tanstack-query";
import { useEffect } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { mealQueryKeys, retrieveMeal } from "../../providers/providerMeal";
import Page from "../Page";

const idAtom = atom<string | undefined>(undefined);
const [, mealQueryAtom] = atomsWithQuery((get) => ({
  queryKey: [mealQueryKeys.meal, get(idAtom)],
  queryFn: () => retrieveMeal(get(idAtom) ?? ""),
  enabled: !!get(idAtom),
  retry: false,
}));

export default function MealRead() {
  const { id } = useParams();
  const setId = useSetAtom(idAtom);
  const [meal] = useAtom(mealQueryAtom);

  useEffect(() => {
    setId(id);
  }, [id, setId]);

  return (
    <Page {...meal}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          rowGap: 1,
          pb: 2,
        }}
      >
        <Typography variant="h5">{meal.data?.name}</Typography>

        <Link component={RouterLink} to={`/meals/edit/${id}`}>
          <Button variant="contained" disabled={meal.isLoading || meal.isError}>
            Edit
          </Button>
        </Link>
      </Box>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 1,
            }}
          >
            <Typography variant="body1" whiteSpace="pre-wrap">
              {meal.data?.notes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Typography variant="body1">Groceries</Typography>
        </CardContent>
      </Card>
    </Page>
  );
}
