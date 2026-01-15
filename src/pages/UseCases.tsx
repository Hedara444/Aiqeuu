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
  Brush as BrushIcon,
} from '@mui/icons-material';
import { usePositionsStore } from '@/store/positionsStore';
import { useUIStore } from '@/store/uiStore';

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
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{
      sx: { borderRadius: "14px", p: 2.5 }
    }}>
      <DialogTitle sx={{ p: 0, mb: 1.2 }}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
          <BrushIcon sx={{ fontSize: '1rem', color: 'text.primary' }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Edit Position
          </Typography>
        </Stack>
      </DialogTitle>

      <Divider sx={{ mb: 2.5 }} />

      <DialogContent sx={{ p: 0, overflowY: 'visible' }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, ml: 0.5, fontSize: '0.75rem' }}>
              Position name
            </Typography>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                  '& input': {
                    p: 0
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, ml: 0.5, fontSize: '0.75rem' }}>
              Description
            </Typography>
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type Your text"
              fullWidth
              multiline
              minRows={3}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  backgroundColor: '#FAFAFA',
                  borderRadius: '8px',
                  p: 1.2,
                  fontSize: '0.8rem',
                  alignItems: 'flex-start'
                }
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 0, mt: 2.5 }}>
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
            onClick={handleSave}
            variant="contained"
            fullWidth
            loading={isLoading}
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              color: "white",
              boxShadow: 'none'
            }}
          >
            save changes
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, isLoading }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{
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
            variant="contained"
            fullWidth
            loading={isLoading}
            sx={{
              height: '32px',
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: "0.8rem",
              color: "white",
              boxShadow: 'none'
            }}
          >
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
  const { positions, getPositions, updatePosition, deletePosition, duplicatePosition, isLoading, pagination } = usePositionsStore();
  const { showAll, setShowAll } = useUIStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const fetchData = async (page = 0, size = 5) => {
    setIsLoadingPage(true)
    await getPositions(page, size)
    setIsLoadingPage(false)
  }

  useEffect(() => {
    fetchData(0, 5)
  }, [])

  const handlePageChange = async (newPage: number) => {
    await getPositions(newPage, 5);
  };

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
      await fetchData(pagination?.pageNumber || 0, 5)
    }
  };

  const confirmDelete = async () => {
    if (selectedPosition) {
      await deletePosition(selectedPosition.id);
      await fetchData(pagination?.pageNumber || 0, 5)
    }
    setIsDeleteModalOpen(false);
    setSelectedPosition(null);
  };

  const confirmDuplicate = async () => {
    if (selectedPosition) {
      await duplicatePosition(selectedPosition.id);
      await fetchData(pagination?.pageNumber || 0, 5)
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

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            disabled={!pagination || pagination.pageNumber === 0}
            onClick={() => handlePageChange((pagination?.pageNumber || 0) - 1)}
            sx={{
               width:'154px',
               height:'43px',
               fontSize:"0.8rem",
              borderRadius: "50px",
              textTransform: "none",
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:disabled': {
                borderColor: 'grey.300',
                color: 'grey.400'
              }
            }}
          >
            Previous
          </Button>

          {pagination && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 , fontSize:'0.7rem' }}>
              Page {pagination.pageNumber + 1} of {pagination.totalPages || 1}
            </Typography>
          )}

          <Button
            variant="outlined"
            disabled={!pagination || (pagination.pageNumber + 1) >= pagination.totalPages}
            onClick={() => handlePageChange((pagination?.pageNumber || 0) + 1)}
            sx={{
               width:'154px',
                      height:'43px',
                      fontSize:"0.8rem",
              borderRadius: "50px",
              textTransform: "none",
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:disabled': {
                borderColor: 'grey.300',
                color: 'grey.400'
              }
            }}
          >
            Next
          </Button>
        </Stack>

      </Container>

     

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
