import { Box, BoxProps } from "@theme-ui/components";

export const MaxWidthContainer = (props: BoxProps) => (
  <Box
    sx={{
      width: "1100px",
      maxWidth: "100%",
      margin: "0 auto",
    }}
    {...props}
  />
);