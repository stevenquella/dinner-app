import { Box, Typography } from "@mui/material";

export type CardTitleProps = {
  text: string;
};

export default function CardTitle(props: CardTitleProps) {
  return (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body1" fontWeight="light">
        {props.text}
      </Typography>
    </Box>
  );
}
