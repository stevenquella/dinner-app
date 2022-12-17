import { Box, Grid, Link, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <Toolbar
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        justifyContent: "center",
      }}
    >
      <Link href="/" underline="none">
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          columnSpacing={1}
        >
          <Grid item>
            <Box
              component="img"
              sx={{
                height: 32,
                width: 32,
              }}
              alt="turkey leg"
              src="/turkey-leg.png"
            />
          </Grid>
          <Grid item>
            <Typography
              component="h2"
              variant="h5"
              color="inherit"
              align="center"
              noWrap
              sx={{ flex: 1 }}
            >
              What's Supper?
            </Typography>
          </Grid>
        </Grid>
      </Link>
    </Toolbar>
  );
}
