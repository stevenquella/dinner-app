import { Box, Link } from "@mui/material";

export type UrlMatchesProps = {
  text?: string | null;
};

const urlRegex = /(http|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gim;

export default function UrlMatches(props: UrlMatchesProps) {
  const matches = props.text?.match(urlRegex);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: 1, mt: 1 }}>
      {matches?.map((x, i) => (
        <Link key={i} href={x} target="_blank">
          {x}
        </Link>
      ))}
    </Box>
  );
}
