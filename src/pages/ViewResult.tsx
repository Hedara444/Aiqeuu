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
import { useTranslation } from 'react-i18next';

const injectViewResultStyles = () => {
  if (document.getElementById('view-result-ux-styles')) return;
  const s = document.createElement('style');
  s.id = 'view-result-ux-styles';
  s.textContent = `
    @keyframes vr-fade-up { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: translateY(0);} }
    @keyframes vr-float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-8px);} }
  `;
  document.head.appendChild(s);
};

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
  const { t } = useTranslation();

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
    injectViewResultStyles();
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fbff 0%, #f5f8fc 100%)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', top: '12%', right: '-90px', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.11), transparent 70%)', animation: 'vr-float 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '12%', left: '-80px', width: 210, height: 210, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.09), transparent 70%)', animation: 'vr-float 10s ease-in-out infinite', pointerEvents: 'none' }} />

      <Box sx={{ px: { xs: 1.5, md: 6 }, position: 'relative', zIndex: 1, animation: 'vr-fade-up .45s ease-out both' }}>
        {/* Progress Steps */}

        <Stepper step={3} />

        {/* Position and   Section */}
        <Container maxWidth="xl" sx={{ pb: 8 }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 6 }}>
            <Box>

              <Typography variant="h4" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #1d2b45 0%, #1776F2 70%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('viewResult.title', { title: currentPosition.title })}</Typography>
            </Box>
            <Box>
              <Button variant="contained" sx={{ color: 'white', fontSize: '0.9rem', borderRadius: '12px', background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 100%)', boxShadow: '0 10px 24px rgba(23,118,242,0.26)', '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 14px 28px rgba(23,118,242,0.32)' } }} endIcon={<DownloadIcon />} onClick={handleOpenMenu}>
                {t('viewResult.export.button')}
              </Button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={handleExportCSV}>{t('viewResult.export.csv')}</MenuItem>
                <MenuItem onClick={handleExportExcel}>{t('viewResult.export.excel')}</MenuItem>
                <MenuItem onClick={handleExportJSON}>{t('viewResult.export.json')}</MenuItem>
              </Menu>
            </Box>
          </Stack>

          {/* Criteria */}
          <Stack sx={{ mb: 6 }}>
            <ToggleSwitch isActive={showCriteria} label={t('viewResult.sections.criteria')} onToggle={() => setShowCriteria(!showCriteria)} />
            <Box sx={{ mt: 3 }}>
              <CriteriaCard criterias={currentPosition.criterias} isVisible={showCriteria} />
            </Box>
          </Stack>

          {/* Analysis Results */}
          <Stack sx={{ mb: 4 }}>
            <ToggleSwitch
              isActive={showAnalysis}
              label={t('viewResult.sections.analysis')}
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
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 3, p: 3, borderColor: 'rgba(23,118,242,0.16)', boxShadow: '0 10px 24px rgba(16,36,63,0.08)' }}>
      <Grid container spacing={3}>
        {criterias.map((criterion, index) => (
          <Grid key={index} size={6}>
            <Paper key={criterion.id} elevation={0} variant="outlined" sx={{ borderRadius: 2, borderColor: 'rgba(23,118,242,0.16)', transition: 'all .22s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(23,118,242,0.12)' } }}>
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
    <Card variant="outlined" sx={{ borderColor: 'rgba(23,118,242,0.18)', borderRadius: '16px', transition: 'all .22s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(23,118,242,0.14)' } }}>
      <CardContent>
        <Stack spacing={3} alignItems="stretch">
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>{result.title}</Typography>
            <Typography variant="subtitle1">Score: {result.score}%</Typography>
          </Stack>

          <Box>
            <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(23,118,242,0.14)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #1776F2 0%, #00D4A8 100%)' } }} />
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
