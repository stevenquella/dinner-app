import { Launch } from "@mui/icons-material";
import { IconButton, Link, List, ListItem, ListItemText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getPlansById, usePlans } from "../../providers/providerPlan";

export type PlansRelatedProps = {
  ids?: string[];
};

export default function PlansRelated(props: PlansRelatedProps) {
  const plans = usePlans();

  return (
    <List disablePadding>
      {getPlansById(plans.data, props.ids).map((plan) => (
        <ListItem
          key={plan.id}
          sx={{
            p: 1.5,
            mb: 1,
            border: 1,
            borderColor: "divider",
          }}
          secondaryAction={
            <Link component={RouterLink} to={`/plans/read/${plan.id}`}>
              <IconButton edge="end">
                <Launch />
              </IconButton>
            </Link>
          }
        >
          <ListItemText primary={plan.date} secondary={plan.notes} />
        </ListItem>
      ))}
      {props.ids?.length === 0 ? <ListItemText primary="No related plans." /> : null}
    </List>
  );
}
