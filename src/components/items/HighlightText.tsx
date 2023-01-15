import { Typography } from "@mui/material";

export type HighlightTextProps = {
  text: string;
  search: string;
};

export default function HighlightText(props: HighlightTextProps) {
  let result = <span>{props.text}</span>;
  if (props.search) {
    const lowerText = props.text.toLowerCase();
    const lowerSearch = props.search.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);
    if (matchIndex !== -1) {
      const parts: { value: string; isMatch: boolean }[] = [];

      // add part before match section
      if (matchIndex > 0) {
        parts.push({
          value: props.text.substring(0, matchIndex),
          isMatch: false,
        });
      }

      parts.push({
        value: props.text.substring(
          matchIndex,
          matchIndex + props.search.length
        ),
        isMatch: true,
      });

      // add part after match section
      if (matchIndex + props.search.length < props.text.length) {
        parts.push({
          value: props.text.substring(
            matchIndex + props.search.length,
            props.text.length
          ),
          isMatch: false,
        });
      }

      result = (
        <span>
          {parts.map((part, i) => (
            <span key={`highlighttext_${i}`}>
              {part.isMatch ? (
                <Typography
                  component="span"
                  sx={{ textDecoration: "underline" }}
                >
                  {part.value}
                </Typography>
              ) : (
                <span>{part.value}</span>
              )}
            </span>
          ))}
        </span>
      );
    }
  }

  return result;
}
