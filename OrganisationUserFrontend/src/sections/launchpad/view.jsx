'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

export default function LaunchpadView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" gutterBottom>
          PaperCraft Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to PaperCraft. Your assessment platform dashboard will be built here.
        </Typography>
      </Box>
    </DashboardContent>
  );
}
