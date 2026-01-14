import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Link as MUILink,
  Tooltip,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { Navbar } from '../components/ui/navbar';
import { usePositionsStore } from '@/store/positionsStore';
import { useUIStore } from '@/store/uiStore';
import { Footer } from '@/components/ui/Footer';

interface EditPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
  onSave: (title: string, description: string) => void;
  isLoading: boolean
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isLoading: boolean
}

const EditPositionModal: React.FC<EditPositionModalProps> = ({ isOpen, onClose, position, onSave, isLoading }) => {
  const [title, setTitle] = useState(position?.title || '');
  const [description, setDescription] = useState(position?.description || '');

  useEffect(() => {
    if (position) {
      setTitle(position.title);
      setDescription(position.description);
    }
  }, [position]);

  const handleSave = () => {
    onSave(title, description);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      sx: { borderRadius: "35px", p: "28px" }
    }}>
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <WorkIcon color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={700}>
            Edit Position
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Position title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type Your text"
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type Your text"
            fullWidth
            multiline
            minRows={4}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack direction="row"  spacing={0} sx={{ width: '100%' , justifyContent:"space-between" }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ width:'30%' }} >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ color: "white", width:'30%'  }}  loading={isLoading}>
            Save changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md" PaperProps={{
      sx: { borderRadius: "35px", p: "28px" }
    }}>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700} textAlign="center" sx={{fontSize:"0.79rem"}} >
          {title}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 2.8 }}>
        <Typography variant="body1" textAlign="center" sx={{ fontSize: "0.79rem" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 2.8 }}>
        <Stack direction="row" spacing={1.4} sx={{ width: '100%' , justifyContent:"space-around"  }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{width:'40%' , height:'35px', fontSize: "0.7rem"}} >
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" sx={{ color: "white" ,  width:'40%' , height:'35px', fontSize: "0.7rem" }} fullWidth loading={isLoading}>
            {confirmText}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const PositionCard: React.FC<{
  position: Position;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}> = ({ position, onEdit, onDelete, onDuplicate }) => {

  const statusConfig: Record<Position['status'], { color: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'; label: string }> = {
    created: { color: 'success', label: 'created' },
    in_progress: { color: 'warning', label: 'analyzing' },
    completed: { color: 'primary', label: 'completed' },
  };
  const config = statusConfig[position.status];

  return (
    <Card variant="outlined" sx={{ borderRadius: "5.6px" }}>
      <CardContent sx={{ padding: "10.5px" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.4}>
          <Stack spacing={0.7} flex={1}>
            <Stack direction="row" alignItems="center" spacing={1.05}>
              <MUILink
                component={RouterLink}
                to={`/position/${position.id}`}
                underline="hover"
                color="text.primary"
                sx={{ fontWeight: 700, typography: 'h6', fontSize: "0.84rem" }}
              >
                {position.title}
              </MUILink>
              <Chip label={config.label} sx={{ color: "white", height: "18px", fontSize: "0.61rem" }} color={config.color} size="small" />
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              {position.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.05} alignItems="center">
            {/* {position.status === 'completed' && (
              <Button
                component={RouterLink}
                to={`/position/${position.id}/completed`}
                variant="text"
                color="primary"
                size="small"
              >
                View Results
              </Button>
            )} */}

            <Tooltip title="Duplicate">
              <IconButton onClick={onDuplicate} color="default" size="small" sx={{ padding: "3.5px" }}>
                <ContentCopyIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton onClick={onEdit} color="default" size="small" sx={{ padding: "3.5px" }}>
                <EditIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton onClick={onDelete} color="default" size="small" sx={{ padding: "3.5px" }}>
                <DeleteIcon sx={{ fontSize: "1.05rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function UseCases() {
  const { positions, getPositions, updatePosition, deletePosition, duplicatePosition, isLoading } = usePositionsStore();
  const { showAll, setShowAll } = useUIStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositions(0, 10)
    setIsLoadingPage(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setIsEditModalOpen(true);
  };

  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteModalOpen(true);
  };

  const handleDuplicate = (position: Position) => {
    setSelectedPosition(position);
    setIsDuplicateModalOpen(true);
  };

  const handleSaveEdit = async (title: string, description: string) => {
    if (selectedPosition) {
      await updatePosition(selectedPosition.id, { title, description });
      await fetchData()
    }
  };

  const confirmDelete = async () => {
    if (selectedPosition) {
      await deletePosition(selectedPosition.id);
      await fetchData()
    }
    setIsDeleteModalOpen(false);
    setSelectedPosition(null);
  };

  const confirmDuplicate = async () => {
    if (selectedPosition) {
      await duplicatePosition(selectedPosition.id);
      await fetchData()
    }
    setIsDuplicateModalOpen(false);
    setSelectedPosition(null);
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
      <Navbar />

      <Container maxWidth="xl" sx={{ pb: 2.1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.8 }}>
          <Typography variant="h4" fontWeight={600} sx={{ fontSize: "1.4rem" }}>
            Use Cases
          </Typography>
          <Button
            component={RouterLink}
            to="/create-position"
            variant="contained"
            sx={{ color: "white", fontSize:"0.61rem", py: 0.7, px: 1.4, borderRadius: "5.6px" }}
            size='small'
          >
            + Add Use Cases 
          </Button>
        </Stack>

        <Stack spacing={1.4} sx={{ mb: 5.6 }}>
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onEdit={() => handleEdit(position)}
              onDelete={() => handleDelete(position)}
              onDuplicate={() => handleDuplicate(position)}
            />
          ))}
        </Stack>

        <Stack alignItems="center">
          <Button variant="contained" color="primary" onClick={() => setShowAll(true)} sx={{ borderRadius: 4.2, color: "white", fontSize: "0.7rem", py: 0.7, px: 1.4 }}>
            See more
          </Button>
        </Stack>

      </Container>

      <Footer />

      <EditPositionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition}
        onSave={handleSaveEdit}
        isLoading={isLoading}

      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPosition(null);
        }}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this position? This action cannot be undone."
        confirmText="Delete"
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={isDuplicateModalOpen}
        onClose={() => {
          setIsDuplicateModalOpen(false);
          setSelectedPosition(null);
        }}
        onConfirm={confirmDuplicate}
        title="Confirm Duplicate"
        message={`Are you sure you want to Duplicate the position ${selectedPosition?.title}?`}
        confirmText="Duplicate"
        isLoading={isLoading}
      />
    </Box >
  );
}
