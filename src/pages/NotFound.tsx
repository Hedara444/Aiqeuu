import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "grey.100",
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4rem" },
              fontWeight: 700,
              mb: 3,
              color: "text.primary",
            }}
          >
            404
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            {t('notFound.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            href="/"
            sx={{
              borderRadius: "25px",
              px: 4,
              py: 2,
              fontSize: "1.125rem",
            }}
          >
            {t('notFound.actions.home')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
