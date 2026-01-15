import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Step,
  StepLabel,
  Switch,
  Link as MUILink,
  Divider,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';

import { CheckCircle, Cancel, Work as WorkIcon, Download as DownloadIcon } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import Stepper from '@/components/ui/Stepper';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { usePositionsStore } from '@/store/positionsStore';
import { useUIStore } from '@/store/uiStore';

// Mock data for candidates - updated to match Figma design
const candidates = [
  {
    id: 1,
    name: 'alice almorshed',
    score: 50,
    criteria: [
      { text: 'Office ipsum be muted. Charts closest desig', passed: true },
      { text: 'Office ipsum be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must closest desig', passed: true },
      { text: 'Office ipsum you must be muted. Charts desig', passed: false },
      { text: 'Office ipsum you must be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must be muted', passed: true },
      { text: 'Office ipsum you closest desig', passed: true },
      { text: 'Office ipsum you must be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must be muted. Charts', passed: true },
    ],
  },
  {
    id: 2,
    name: 'alice almorshed',
    score: 50,
    criteria: [
      { text: 'Office ipsum be muted. Charts closest desig', passed: true },
      { text: 'Office ipsum be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must closest desig', passed: true },
      { text: 'Office ipsum you must be muted. Charts desig', passed: false },
      { text: 'Office ipsum you must be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must be muted', passed: true },
      { text: 'Office ipsum you closest desig', passed: true },
      { text: 'Office ipsum you must be muted. Charts closest desig', passed: false },
      { text: 'Office ipsum you must be muted. Charts', passed: true },
    ],
  },
];

const CandidateCard = ({ candidate }: { candidate: typeof candidates[0] }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} alignItems="stretch">
          {/* Header with name and score */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {candidate.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary" fontWeight={500}>
              Score: {candidate.score}%
            </Typography>
          </Stack>

          {/* Progress bar */}
          <Box>
            <LinearProgress
              variant="determinate"
              value={candidate.score}
              sx={{ height: 8, borderRadius: 4 }}
              color="primary"
            />
          </Box>

          {/* Analysis criteria list */}
          <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
            <List disablePadding>
              {candidate.criteria.map((criterion, index) => (
                <>
                  <ListItem key={index} sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {criterion.passed ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Cancel color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                      primary={criterion.text}
                    />
                  </ListItem>
                  {index !== candidate.criteria.length - 1 && <Divider component="li" />}
                </>
              ))}
            </List>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ToggleSwitch: React.FC<{
  isActive: boolean;
  label: string;
  onToggle?: () => void;
}> = ({ isActive, label, onToggle }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Switch checked={isActive} onChange={onToggle} />
      <Typography variant="h5" fontWeight={700}>{label}</Typography>
    </Stack>
  );
};

export default function ViewResult() {
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



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>

      <Box sx={{ px: { xs: 1.5, md: 6 } }}>
        {/* Progress Steps */}

        <Stepper step={3} />

        {/* Position and   Section */}
        <Container maxWidth="xl" sx={{ pb: 8 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
            <Box>
              <MUILink component={RouterLink} to={`/position/${id}`} underline="hover" color="primary" sx={{ display: 'inline-block', mb: 2 , fontSize:'1.2rem' }}>
                ← Back to Position
              </MUILink>
              <Typography variant="h4" fontWeight={600}>{currentPosition.title} - Analysis Results</Typography>
            </Box>
            <Box>
              <Button variant="contained" sx={{ color: "white"  , fontSize:"0.9rem" }} endIcon={<DownloadIcon />} onClick={handleOpenMenu}>
                Export
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
                <MenuItem onClick={handleExportExcel}>Export as Excel</MenuItem>
                <MenuItem onClick={handleExportJSON}>Export as JSON</MenuItem>
              </Menu>
            </Box>
          </Stack>

          {/* Criteria */}
          <Stack sx={{ mb: 6 }}>
            <ToggleSwitch isActive={showCriteria} label="Criteria" onToggle={() => setShowCriteria(!showCriteria)} />
            <Box sx={{ mt: 3 }}>
              <CriteriaCard criterias={currentPosition.criterias} isVisible={showCriteria} />
            </Box>
          </Stack>

          {/* Analysis Results */}
          <Stack sx={{ mb: 4 }}>
            <ToggleSwitch
              isActive={showAnalysis}
              label="Analysis cv"
              onToggle={() => setShowAnalysis(!showAnalysis)}
            />

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
      </Box>
    </Box>
  );
}

const CriteriaCard: React.FC<{
  criterias: Criteria[];
  isVisible: boolean;
}> = ({ criterias, isVisible }) => {
  if (!isVisible) return null;


  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 3 }}>
      <Grid container spacing={3}>
        {criterias.map((criterion, index) => (
          <Grid key={index} size={6}>
            <Paper key={criterion.id} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 2 }}>
                <ToggleSwitch isActive={true} label={`Criteria-${index + 1}`} onToggle={() => console.log("d")} />
                <Typography variant="body1" fontWeight={700}>{criterion.description}</Typography>
              </Stack>
            </Paper>
          </Grid >

        ))}

      </Grid>
    </Paper>
  );
};

const AnalysisCard: React.FC<{ result: Resume ,  showAnalysisGlobal: boolean }> = ({ result , showAnalysisGlobal  }) => {
  const progressPercentage = result.score;
  const [showAnalysisLocal, setShowAnalysisLocal] = useState(true);


  const shouldShowExplanation = showAnalysisGlobal && showAnalysisLocal;
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={3} alignItems="stretch">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>{result.title}</Typography>
            <Typography variant="subtitle1">Score: {result.score}%</Typography>
          </Stack>

          <Box>
            <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
          </Box>

          {/* LOCAL toggle */}
          <ToggleSwitch
            isActive={showAnalysisLocal}
            label="Analysis cv"
            onToggle={() => setShowAnalysisLocal(prev => !prev)}
          />

          {/* Explanation (controlled by BOTH toggles) */}
          {shouldShowExplanation && (
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
              <ListItemText >{result.explanation}</ListItemText>
            </Paper>
          )}

          {/* <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <List disablePadding>
              {result.criteriaResults?.map((criteriaResult, index) => (
                <>
                  <ListItem key={criteriaResult.id} sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {criteriaResult.passed ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Cancel color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: 'body1', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      primary={criteriaResult.text}
                      secondary={`Confidence: ${Math.round(criteriaResult.confidence * 100)}%`}
                    />
                  </ListItem>
                  {index !== result.criteriaResults.length - 1 && <Divider component="li" />}
                </>
              ))}
            </List>
          </Paper> */}
        </Stack>
      </CardContent>
    </Card>
  );
};
