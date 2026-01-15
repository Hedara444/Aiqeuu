import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Navigation */}

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 15 } }}>
        <Card
          sx={{
            borderRadius: "20px",
            p: { xs: 6, md: 12 },
            textAlign: "center",
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Stack spacing={4} alignItems="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                {title}
              </Typography>

              {description && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {description}
                </Typography>
              )}

              <Typography
                variant="body1"
                sx={{
                  color: "grey.500",
                  maxWidth: "600px",
                }}
              >
                This page is under construction. Continue prompting to have me fill in this page content.
              </Typography>

              <Button
                variant="contained"
                component={Link}
                to="/dashboard"
                startIcon={<ArrowBackIcon />}
                sx={{
                  borderRadius: "20px",
                  px: 4,
                  py: 2,
                  fontSize: "1.125rem",
                  mt: 2,
                }}
              >
                Back to Dashboard
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

    </Box>
  );
}
