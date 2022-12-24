import { Alert } from "@mui/material";

export type ErrorAlertProps = {
  error: string | null;
};

export default function ErrorAlert(props: ErrorAlertProps) {
  return (
    <div>
      {props.error != null ? (
        <Alert severity="error">{props.error}</Alert>
      ) : null}
    </div>
  );
}
