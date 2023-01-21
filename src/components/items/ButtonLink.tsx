import { Button, Link, SxProps } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export type ButtonLinkProps = {
  to: string;
  text: string;
  sx?: SxProps;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

export default function ButtonLink(props: ButtonLinkProps) {
  return (
    <Link component={RouterLink} underline="none" to={props.to}>
      <Button variant={props.variant} color={props.color} size={props.size} sx={props.sx} disabled={props.disabled}>
        {props.text}
      </Button>
    </Link>
  );
}
