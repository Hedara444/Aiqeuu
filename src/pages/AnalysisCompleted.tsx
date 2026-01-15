import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Navbar } from '../components/ui/navbar';
import { usePositionsStore } from '@/store/positionsStore';
import { useCriteriaStore } from '@/store/criteriaStore';
import { useAnalysisStore } from '@/store/analysisStore';
import { useUIStore } from '@/store/uiStore';
import { CVAnalysisResult } from '../types';

import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  Grid,
  Link as MUILink,
  Menu,
  MenuItem,
  Switch,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Download as DownloadIcon, CheckCircle, Cancel } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import { Footer } from '@/components/ui/Footer';

const ToggleSwitch: React.FC<{
  isActive: boolean;
  label: string;
  onToggle?: () => void;
}> = ({ isActive, label, onToggle }) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Switch checked={isActive} onChange={onToggle} size="small" />
      <Typography fontWeight={700} sx={{ fontSize: '0.9rem' }}>{label}</Typography>
    </Stack>
  );
};

const CriteriaCard: React.FC<{
  criterias: Criteria[];
  isVisible: boolean;
}> = ({ criterias, isVisible }) => {
  if (!isVisible) return null;


  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
      <Grid container spacing={1.5}>
        {criterias.map((criterion, index) => (
          <Grid key={index} size={6}>
            <Paper key={criterion.id} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.5 }}>
                <ToggleSwitch isActive={true} label={`Criteria-${index + 1}`} onToggle={() => console.log("d")} />
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>{criterion.description}</Typography>
              </Stack>
            </Paper>
          </Grid >

        ))}

      </Grid>
    </Paper>
  );
};

const AnalysisCard: React.FC<{ result: Resume ,  showAnalysisGlobal: boolean; }> = ({ result , showAnalysisGlobal }) => {
  const progressPercentage = result.score;
  const [showAnalysisLocal, setShowAnalysisLocal] = useState(true);

  const shouldShowExplanation = showAnalysisGlobal && showAnalysisLocal;


  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5} alignItems="stretch">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1rem' }}>{result.title}</Typography>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>Score: {result.score}%</Typography>
          </Stack>

          <Box>
            <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 6, borderRadius: 3 }} />
          </Box>

          {/* LOCAL toggle */}
          <ToggleSwitch
            isActive={showAnalysisLocal}
            label="Analysis cv2"
            onToggle={() => setShowAnalysisLocal(prev => !prev)}
          />

          {/* Explanation (controlled by BOTH toggles) */}
          {shouldShowExplanation && (
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
              <ListItemText>{result.explanation}</ListItemText>
            </Paper>
          )}

          {/*<Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>*/}
          {/*  <List disablePadding>*/}
          {/*    {result.criteriaResults?.map((criteriaResult, index) => (*/}
          {/*      <>*/}
          {/*        <ListItem key={criteriaResult.id} sx={{ py: 0.75, px: 1 }}>*/}
          {/*          <ListItemIcon sx={{ minWidth: 28 }}>*/}
          {/*            {criteriaResult.passed ? (*/}
          {/*              <CheckCircle color="success" sx={{ fontSize: 18 }} />*/}
          {/*            ) : (*/}
          {/*              <Cancel color="error" sx={{ fontSize: 18 }} />*/}
          {/*            )}*/}
          {/*          </ListItemIcon>*/}
          {/*          <ListItemText*/}
          {/*            primaryTypographyProps={{ variant: 'body2', fontWeight: 500, fontSize: '0.8125rem' }}*/}
          {/*            secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.7rem' }}*/}
          {/*            primary={criteriaResult.text}*/}
          {/*            secondary={`Confidence: ${Math.round(criteriaResult.confidence * 100)}%`}*/}
          {/*          />*/}
          {/*        </ListItem>*/}
          {/*        {index !== result.criteriaResults.length - 1 && <Divider component="li" />}*/}
          {/*      </>*/}
          {/*    ))}*/}
          {/*  </List>*/}
          {/*</Paper>*/}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function AnalysisCompleted() {
  const { id } = useParams<{ id: string }>();
  const { currentPosition, getPositionById } = usePositionsStore();
  const { showCriteria, showAnalysis, setShowCriteria, setShowAnalysis } = useUIStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositionById(id)
    setIsLoadingPage(false)
  }

  useEffect(() => {
    fetchData()
  }, [])


  if (isLoadingPage) {
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

  if (!currentPosition) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight={700}>Position Not Found</Typography>
            <Typography color="text.secondary">The position you're looking for doesn't exist.</Typography>
            <Button component={RouterLink} to="/use-cases" variant="contained">Back to Use Cases</Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  const handleExportCSV = () => {
    console.log("CSV")
    handleCloseMenu();
  };

  const handleExportExcel = () => {
    console.log("Excel")
    handleCloseMenu();
  };

  const handleExportJSON = () => {
    console.log("JSON")
    handleCloseMenu();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ pb: 4, mt: 2 ,minheight:'100vh' }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4   }}>
          <Box>
            <MUILink component={RouterLink} to={`/position/${id}`} underline="hover" color="primary" sx={{ display: 'inline-block', mb: 0.5, fontSize: '0.875rem' }}>
              ← Back to Position
            </MUILink>
            <Typography variant="h5" fontWeight={600} sx={{ fontSize: '1.25rem' }}>{currentPosition.title} - Analysis Results</Typography>
          </Box>
          <Box>
            <Button variant="contained" sx={{ color: "white"  , width:'130px' , height:'42px' , fontSize:'0.7rem' }} endIcon={<DownloadIcon sx={{ fontSize: '1.1rem' }} />} onClick={handleOpenMenu} size="small">
              Export
            </Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <MenuItem onClick={handleExportCSV} sx={{ fontSize: '0.875rem' }}>Export as CSV</MenuItem>
              <MenuItem onClick={handleExportExcel} sx={{ fontSize: '0.875rem' }}>Export as Excel</MenuItem>
              <MenuItem onClick={handleExportJSON} sx={{ fontSize: '0.875rem' }}>Export as JSON</MenuItem>
            </Menu>
          </Box>
        </Stack>

        {/* Criteria */}
        <Stack sx={{ mb: 3 }}>
          <ToggleSwitch isActive={showCriteria} label="Criteria" onToggle={() => setShowCriteria(!showCriteria)} />
          <Box sx={{ mt: 2 ,fontSize:'0.9rem' }}>
            <CriteriaCard  criterias={currentPosition.criterias} isVisible={showCriteria} />
          </Box>
        </Stack>

        {/* Analysis Results */}
        <Stack sx={{ mb: 2 }}>
          <ToggleSwitch isActive={showAnalysis} label="Analysis cv" onToggle={() => setShowAnalysis(!showAnalysis)} />
        </Stack>

        <Grid container spacing={3}>
          {currentPosition.resumes.map((result) => (
            <Grid size={6} key={result.id}>
              <AnalysisCard
                result={result}
                showAnalysisGlobal={showAnalysis}
              />
            </Grid>
          ))}
        </Grid>


      </Container>

      {/* Footer */}
      <Footer />
    </Box>
  );
}