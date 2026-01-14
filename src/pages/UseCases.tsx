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
      sx: { borderRadius: "50px", p: "40px" }
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
      sx: { borderRadius: "50px", p: "40px" }
    }}>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700} textAlign="center">
          {title}
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ px: 4 }}>
        <Typography variant="body1" textAlign="center">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ mt: 4 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button onClick={onClose} variant="outlined" color="inherit" fullWidth>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" sx={{ color: "white" }} fullWidth loading={isLoading}>
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
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack spacing={1} flex={1}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <MUILink
                component={RouterLink}
                to={`/position/${position.id}`}
                underline="hover"
                color="text.primary"
                sx={{ fontWeight: 700, typography: 'h6' }}
              >
                {position.title}
              </MUILink>
              <Chip label={config.label} sx={{ color: "white" }} color={config.color} size="small" />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              {position.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
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
              <IconButton onClick={onDuplicate} color="default" size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Edit">
              <IconButton onClick={onEdit} color="default" size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton onClick={onDelete} color="default" size="small">
                <DeleteIcon fontSize="small" />
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

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={600}>
            Use Cases
          </Typography>
          <Button
            component={RouterLink}
            to="/create-position"
            variant="contained"
            sx={{ color: "white" }}
            size="medium"
          >
            + Add Use Cases
          </Button>
        </Stack>

        <Stack spacing={2} sx={{ mb: 8 }}>
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
          <Button variant="contained" color="primary" onClick={() => setShowAll(true)} sx={{ borderRadius: 6, color: "white" }}>
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