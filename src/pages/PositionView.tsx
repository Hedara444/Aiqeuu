import { useEffect, useState } from 'react';
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
  Brush as BrushIcon,
} from '@mui/icons-material';

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
  const fileInputRef = useState<HTMLInputElement | null>(null);

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
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: { borderRadius: "14px", p: 2.5 }
    }}>
      <DialogTitle sx={{ p: 0, mb: 1.2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <BrushIcon sx={{ fontSize: '1rem', color: 'text.primary' }} />
          <Typography variant="subtitle1" fontWeight={700}>Upload Resumes</Typography>
        </Stack>
      </DialogTitle>

      <Divider sx={{ mb: 2.5 }} />

      <DialogContent sx={{ p: 0, mb: 2.5, overflowY: 'visible' }}>
        <Box
          component="label"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            height: 140,
            border: '1.5px dashed',
            borderColor: isDragOver ? 'primary.main' : 'grey.300',
            borderRadius: '12px',
            bgcolor: isDragOver ? 'success.lighter' : 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <input hidden multiple accept=".pdf,.doc,.docx" type="file" onChange={handleFileSelect} id="resume-upload-input" />
          <UploadFileIcon sx={{ fontSize: 24, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            <span style={{ textDecoration: 'underline', fontWeight: 700, color: 'black' }}>Click to upload</span> or drag and drop
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              borderColor: 'grey.300'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => document.getElementById('resume-upload-input')?.click()}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              color: "white",
              boxShadow: 'none'
            }}
            loading={isLoading}
          >
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: { borderRadius: "14px", p: 2.5 }
    }}>
      <DialogTitle sx={{ p: 0, mb: 1.2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <BrushIcon sx={{ fontSize: '1rem', color: 'text.primary' }} />
          <Typography variant="subtitle1" fontWeight={700}>Add New Criteria</Typography>
        </Stack>
      </DialogTitle>

      <Divider sx={{ mb: 2.5 }} />

      <DialogContent sx={{ p: 0, mb: 2.5, overflowY: 'visible' }}>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, ml: 0.5, fontSize: '0.75rem' }}>
            Description
          </Typography>
          <TextField
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type Your text"
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: {
                backgroundColor: '#FAFAFA',
                borderRadius: '8px',
                p: 1.2,
                fontSize: '0.8rem',
                '& input': { p: 0 }
              }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              borderColor: 'grey.300'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              color: "white",
              boxShadow: 'none'
            }}
            loading={isLoading}
          >
            Add Criteria
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: { borderRadius: "14px", p: 2.5 }
    }}>
      <DialogTitle sx={{ p: 0, mb: 1.2 }}>
        <Typography variant="subtitle1" fontWeight={700} textAlign="center">
          {title}
        </Typography>
      </DialogTitle>

      <Divider sx={{ mb: 2.5 }} />

      <DialogContent sx={{ p: 0, mb: 2.5 }}>
        <Typography variant="body2" textAlign="center" sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 0 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              borderColor: 'grey.300'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              color: "white",
              boxShadow: 'none'
            }}
            variant="contained"
            color="primary"
            fullWidth
            loading={isLoading}
          >
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
              <Button variant="contained" sx={{ color: "white"  , width:"240px"  , height :'40px' , fontSize:'0.7rem' }} startIcon={<AddIcon />} onClick={() => setIsAddCriteriaModalOpen(true)}>
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