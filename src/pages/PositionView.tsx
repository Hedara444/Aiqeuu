import { useEffect, useState } from 'react';
import { Navbar } from '../components/ui/navbar';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { usePositionsStore } from '@/store/positionsStore';
import { useCriteriaStore } from '@/store/criteriaStore';
import { useResumesStore } from '@/store/resumesStore';
import { useAnalysisStore } from '@/store/analysisStore';
import { useUIStore } from '@/store/uiStore';

import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
  Chip,
  Grid,
  Link as MUILink,
  Tooltip,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  UploadFile as UploadFileIcon,
  Add as AddIcon,
  PictureAsPdf as PictureAsPdfIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { Footer } from '@/components/ui/Footer';

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: FileList) => void;
  isLoading: boolean
}

interface AddCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (description: string) => void;
  isLoading: boolean
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean
}

const UploadResumeModal: React.FC<UploadResumeModalProps> = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
      onClose();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onUpload(e.target.files);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
          <UploadFileIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>Upload Resumes</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            height: 220,
            border: '2px dashed',
            borderColor: isDragOver ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            bgcolor: isDragOver ? 'success.lighter' : 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 1,
          }}
          {
          ...(isDragOver ? { boxShadow: 0 } : {})
          }
        >
          <PictureAsPdfIcon color="action" sx={{ fontSize: 38 }} />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component="label" variant="text" color="primary" sx={{ textDecoration: 'underline', fontWeight: 700  , fontSize:'1rem' }}>
              Click to upload
              <input hidden multiple accept=".pdf,.doc,.docx" type="file" onChange={handleFileSelect} />
            </Button>
            <Typography variant="h6" fontWeight={600}>
              or drag and drop
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ width: '100%' , justifyContent:'space-evenly' , mb:1 , mt:1}}>
          <Button onClick={onClose} variant="outlined" color="inherit"  sx={{ width:'25%' , fontSize:'0.8rem'}} >
            Cancel
          </Button>
          <Button onClick={onClose} variant="contained" color="primary" sx={{ width:'25%' , fontSize:'0.8rem'}}  loading={isLoading}>
            Upload Resumes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const AddCriteriaModal: React.FC<AddCriteriaModalProps> = ({ isOpen, onClose, onAdd, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (description.trim()) {
      await onAdd(description);
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
          <AddIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>Add New Criteria</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Description"
          placeholder="Type Your text"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button onClick={onClose} variant="outlined" color="inherit" fullWidth>
            Cancel
          </Button>
          <Button onClick={handleAdd} variant="contained" color="primary" fullWidth loading={isLoading}>
            Add Criteria
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography fontWeight={700} textAlign="center">{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" textAlign="center">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button onClick={onClose} variant="outlined" color="inherit" fullWidth>
            Cancel
          </Button>
          <Button onClick={onConfirm} sx={{ color: "white" }} variant="contained" color="primary" fullWidth loading={isLoading}>
            Delete
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const CriteriaItem: React.FC<{
  criteria: Criteria;
  onDelete: () => void;
  status: string;
  index: number
}> = ({ criteria, onDelete, index }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 ,  }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <DragIndicatorIcon color="disabled" />
          <Typography variant="body1" color="text.secondary" fontWeight={500} sx={{fontSize:'0.9rem'}}>
            {`Criteria- ${index + 1}`}:
          </Typography>
          <Stack direction="row" spacing={5} alignItems="center">
            <Typography  variant="body2" color="text.secondary" sx={{fontSize:'0.9rem'}}>Created: {new Date(criteria.createdAt).toLocaleDateString()}</Typography>
            <Typography variant="body2" fontWeight={700} sx={{fontSize:'0.9rem'}} >{criteria.description}</Typography>
          </Stack>
        </Stack>
        {status === "created" &&
          <Tooltip title="Delete">
            <IconButton color="default" onClick={onDelete} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        }

      </Stack>
    </Paper>
  );
};

const ResumeCard: React.FC<{
  resume: Resume;
  onDelete: () => void;
}> = ({ resume, onDelete }) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, width: 320, display: 'flex', alignItems: 'center', gap: 2 }}>
      <PictureAsPdfIcon color="action" sx={{ fontSize: 40 }} />
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{fontSize:'1rem'}} >{resume.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{fontSize:'0.9rem'}}>{resume.createdAt}</Typography>
      </Box>
      <Tooltip title="Delete">
        <IconButton color="default" onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default function PositionView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentPosition, getPositionById, addCriteria, deleteCriteria, deleteResume, addResume, getResumeFile, startProcessing, isLoading } = usePositionsStore();
  // const { getCriteria, addCriteria, deleteCriteria } = useCriteriaStore();
  // const { getResumes, addMultipleResumes, deleteResume } = useResumesStore();
  // const { getAnalysisSession } = useAnalysisStore();
  const { isAnalyzing, setIsAnalyzing } = useUIStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddCriteriaModalOpen, setIsAddCriteriaModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteModalOpen2, setIsDeleteModalOpen2] = useState(false);

  const [deletingCriteria, setDeletingCriteria] = useState<Criteria | null>(null);
  const [deletingResume, setDeletingResume] = useState<Resume | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState(true);


  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositionById(id!)
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
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h4" fontWeight={700}>Position Not Found</Typography>
            <Typography color="text.secondary">The position you're looking for doesn't exist.</Typography>
            <Button component={RouterLink} to="/use-cases" variant="contained">Back to Use Cases</Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  const handleUploadResumes = async (files: FileList) => {
    try {
      const fileArray = Array.from(files);

      // Process files in parallel for better performance
      await Promise.all(fileArray.map(file => addResume(file, id)));

      await fetchData();
    } catch (error) {
      console.error('Error uploading resumes:', error);
      throw error;
    }
  };

  const handleAddCriteria = async (description: string) => {
    await addCriteria(id, description)
    await fetchData()
  };

  const handleDeleteCriteria = (criteriaItem: Criteria) => {
    setDeletingCriteria(criteriaItem);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCriteria = async () => {
    if (deletingCriteria) {
      await deleteCriteria(deletingCriteria.id);
      await fetchData()
    }
    setIsDeleteModalOpen(false);
    setDeletingCriteria(null);
  };

  const handleDeleteResume = async (resume: Resume) => {
    setDeletingResume(resume);
    setIsDeleteModalOpen2(true);
  };

  const confirmDeleteResume = async () => {
    if (deletingResume) {
      await deleteResume(deletingResume.id);
      await fetchData()
    }
    setIsDeleteModalOpen2(false);
    setDeletingResume(null);
  };

  const statusConfig: Record<Position['status'], { color: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'; label: string }> = {
    created: { color: 'success', label: 'created' },
    in_progress: { color: 'warning', label: 'analyzing' },
    completed: { color: 'primary', label: 'completed' },
  };
  const config = statusConfig[currentPosition.status];

  const handleStartAnalysis = async () => {
    if (currentPosition.criterias.length === 0) {
      alert('Please add at least one criteria before starting analysis.');
      return;
    }
    if (currentPosition.resumes.length === 0) {
      alert('Please upload at least one resume before starting analysis.');
      return;
    }


    try {
      setIsAnalyzing(true);
      await startProcessing(id)
    } catch (e) {
      console.log(e)
      setIsAnalyzing(false);
    } finally {
      navigate(`/position/${id}/completed`);
      setIsAnalyzing(false);
    }


  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 , mt:3 }}>
          <Typography variant="h4" fontWeight={600}>{currentPosition.title}:</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" sx={{ color: "white" , width:"240px"  , height :'40px' , fontSize:'0.7rem'}}   startIcon={<UploadFileIcon />} onClick={() => setIsUploadModalOpen(true)}>
              Upload Resume
            </Button>
            {
              currentPosition.status === "created" &&
              <Button variant="contained" sx={{ color: "white" , fontSize:'0.9rem' }} startIcon={<AddIcon />} onClick={() => setIsAddCriteriaModalOpen(true)}>
                Add Criteria
              </Button>
            }

          </Stack>
        </Stack>

        {/* Position Details */}
        <Paper variant="outlined" sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6" fontWeight={700}>{currentPosition.title}</Typography>
              <Chip label={config.label} sx={{ color: "white" }} color={config.color} size="small" />
            </Stack>
            {currentPosition.description && (
              <Typography color="text.secondary">{currentPosition.description}</Typography>
            )}
          </Stack>
        </Paper>

        {/* Criteria */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{}} >Criteria</Typography>
          <Stack spacing={1.5}>
            {currentPosition.criterias.map((c, index) => (
              <CriteriaItem status={currentPosition.status} index={index} key={c.id} criteria={c} onDelete={() => handleDeleteCriteria(c)} />
            ))}
          </Stack>
        </Stack>

        {/* Resumes */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700}>Resumes </Typography>
          <Grid container spacing={2}>
            {currentPosition.resumes.map((r) => (
              <Grid key={r.id}>
                <ResumeCard resume={r} onDelete={() => handleDeleteResume(r)} />
              </Grid>
            ))}
          </Grid>
        </Stack>

        {/* Actions */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button variant="contained" color="success" sx={{ color: "white" ,width:"240px"  , height :'40px' , fontSize:'0.7rem' }} onClick={handleStartAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
          </Button>
          {/* <Button component={RouterLink} to="/use-cases" variant="outlined">Back to Use Cases</Button> */}
        </Stack>
      </Container>

      <Footer />

      {/* Modals */}
      <UploadResumeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadResumes}
        isLoading={isLoading}
      />
      <AddCriteriaModal
        isOpen={isAddCriteriaModalOpen}
        onClose={() => setIsAddCriteriaModalOpen(false)}
        onAdd={handleAddCriteria}
        isLoading={isLoading}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteCriteria}
        title="Confirm Deletion"
        message={deletingCriteria ? `Are you sure you want to delete ${deletingCriteria.description}?` : ''}
        isLoading={isLoading}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen2}
        onClose={() => setIsDeleteModalOpen2(false)}
        onConfirm={confirmDeleteResume}
        title="Confirm Deletion"
        message={deletingResume ? `Are you sure you want to delete ${deletingResume.title}?` : ''}
        isLoading={isLoading}
      />

    </Box>
  );
}