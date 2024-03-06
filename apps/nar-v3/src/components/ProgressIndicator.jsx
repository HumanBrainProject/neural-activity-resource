import { Box, CircularProgress } from "@mui/material";

function ProgressIndicator() {
  return (
    <Box justifyContent="center" display="flex" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );
}

export default ProgressIndicator;
