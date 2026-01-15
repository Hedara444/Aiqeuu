import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Stack,
  Grid,
  CircularProgress
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useProfileStore } from '@/store/profileStore';

export default function History() {
  const { history, getHistory, isLoading } = useProfileStore();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      await getHistory(page, pageSize);
      setHasMore(history.length === pageSize);
    };
    fetchData();
  }, []);

  const handleSeeMore = async () => {
    const nextPage = page + 1;
    try {
      await getHistory(nextPage, pageSize);

      // Check if we got a full page of results
      if (history.length < pageSize) {
        setHasMore(false);
      } else {
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more history:', error);
    }
  };

  // If still loading and no history exists, show a loading spinner
  if (isLoading && history.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ pb: { xs: 8, md: 25 } }}>
        {/* Header */}
        <Box textAlign="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "4.5rem" },
              fontWeight: 700,
              mb: 3,
              color: "text.primary",
            }}
          >
            History
          </Typography>
        </Box>

        {/* History List */}
        <Container maxWidth="xl">
          {history.length === 0 ? (
            <Box textAlign="center" sx={{ py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No history found
              </Typography>
            </Box>
          ) : (
            <>
              <Stack spacing={2}>
                {history.map((entry) => (
                  <Card
                    key={entry.id}
                    sx={{
                      borderRadius: { xs: "12px", md: "20px" },
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardContent sx={{ px: { xs: 3, md: 5 }, py: { xs: 3, md: 4 } }}>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 4 }}
                        alignItems="center"
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 5, sm: 10 }
                        }}
                      >
                        <Grid>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "grey.500",
                              fontSize: { xs: "1.125rem", md: "1.25rem" },
                            }}
                          >
                            Amount : {entry.amount}
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "text.primary",
                              fontWeight: 700,
                              fontSize: { xs: "1.125rem", md: "1.25rem" },
                            }}
                          >
                            paid at: {new Date(entry.createdAt).toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>

              {/* See More Button - Only show if there's more data */}
              {hasMore && (
                <Box display="flex" justifyContent="center" sx={{ mt: { xs: 6, md: 8 } }}>
                  <Button
                    variant="contained"
                    onClick={handleSeeMore}
                    disabled={isLoading}
                    endIcon={isLoading ? <CircularProgress size={20} /> : <ExpandMoreIcon />}
                    sx={{
                      borderRadius: "25px",
                      px: { xs: 4, md: 6 },
                      py: 2,
                      color: "white",
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      minWidth: { xs: 180, md: 200 },
                    }}
                  >
                    {isLoading ? 'Loading...' : 'See More'}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Container>
      </Container>
    </Box>
  );
}