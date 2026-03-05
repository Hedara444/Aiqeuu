import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Button, Container, Card, CardContent,
  TextField, Stack, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, Link as MUILink,
  Tooltip, CircularProgress, Divider,
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, ContentCopy as ContentCopyIcon,
  Brush as BrushIcon, AddCircleOutline as AddIcon,
  FolderOpen as FolderIcon, Science as ScienceIcon, AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { usePositionsStore } from '@/store/positionsStore';

/* ── Inject Styles ───────────────────────────────────────────────────── */
const injectCasesStyles = () => {
  if (document.getElementById('cases-anim-styles')) return;
  const s = document.createElement('style');
  s.id = 'cases-anim-styles';
  s.textContent = `
    @keyframes fade-up {
      from { opacity: 0; transform: translateY(15px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer-bg {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes float-orb {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(20px, -20px) scale(1.05); }
    }
    .use-case-card {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .use-case-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(23,118,242,0.12), 0 2px 8px rgba(0,0,0,0.04);
      border-color: rgba(23,118,242,0.3) !important;
    }
    .modal-paper {
      border-radius: 20px !important;
      border: 1px solid rgba(23,118,242,0.1) !important;
      box-shadow: 0 24px 60px rgba(0,0,0,0.15) !important;
      background: rgba(255,255,255,0.98) !important;
      backdrop-filter: blur(12px) !important;
    }
    .input-field input { font-family: Montserrat !important; font-size: 0.8rem; }
    .input-field textarea { font-family: Montserrat !important; font-size: 0.8rem; }
  `;
  document.head.appendChild(s);
};

/* ── Interfaces ──────────────────────────────────────────────────────── */
interface EditPositionModalProps {
  isOpen: boolean; onClose: () => void; position: any | null;
  onSave: (title: string, description: string) => void;
  isLoading: boolean;
}

interface ConfirmModalProps {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; confirmText: string;
  isLoading: boolean;
}

/* ── Edit Modal ──────────────────────────────────────────────────────── */
const EditPositionModal: React.FC<EditPositionModalProps> = ({ isOpen, onClose, position, onSave, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (position) { setTitle(position.title); setDescription(position.description); }
  }, [position]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ className: 'modal-paper' }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(23,118,242,0.1), rgba(0,212,168,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1776F2',
          }}><BrushIcon sx={{ fontSize: '1.1rem' }} /></Box>
          <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.1rem', fontWeight: 800, color: '#1E1E1E' }}>
            Edit Position
          </Typography>
        </Stack>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2, overflowY: 'visible' }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, mb: 0.8, fontSize: '0.75rem', color: '#5a6070' }}>Position Name</Typography>
            <TextField
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer" fullWidth variant="outlined"
              className="input-field"
              InputProps={{ sx: { borderRadius: '12px', background: '#FAFAFA', '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' } } }}
            />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 700, mb: 0.8, fontSize: '0.75rem', color: '#5a6070' }}>Description</Typography>
            <TextField
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief description of the role requirements..." fullWidth multiline minRows={4} variant="outlined"
              className="input-field"
              InputProps={{ sx: { borderRadius: '12px', background: '#FAFAFA', '& fieldset': { borderColor: '#E2E8F0' }, '&:hover fieldset': { borderColor: '#CBD5E1' } } }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
          <Button onClick={onClose} variant="outlined" fullWidth
            sx={{ height: '40px', borderRadius: '10px', textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700, fontSize: "0.8rem", color: '#5a6070', borderColor: '#E2E8F0', '&:hover': { background: '#f8fafc', borderColor: '#CBD5E1' } }}
          >Cancel</Button>
          <Button onClick={() => { onSave(title, description); onClose(); }} variant="contained" fullWidth disabled={isLoading}
            sx={{ height: '40px', borderRadius: '10px', textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700, fontSize: "0.8rem", color: "white", background: 'linear-gradient(135deg, #1776F2, #0d5fcc)', boxShadow: '0 4px 12px rgba(23,118,242,0.25)', '&:hover': { boxShadow: '0 6px 16px rgba(23,118,242,0.4)' } }}
          >Save Changes</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

/* ── Confirm Modal ───────────────────────────────────────────────────── */
const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText, isLoading }) => (
  <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ className: 'modal-paper' }}>
    <Box sx={{ p: 3, pb: 1, textAlign: 'center' }}>
      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '1.2rem', fontWeight: 800, color: title.includes('Delete') ? '#ef4444' : '#1E1E1E', mb: 1 }}>{title}</Typography>
      <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.82rem', fontWeight: 500, color: '#5a6070', lineHeight: 1.5 }}>{message}</Typography>
    </Box>
    <DialogActions sx={{ p: 3 }}>
      <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
        <Button onClick={onClose} variant="outlined" fullWidth
          sx={{ height: '40px', borderRadius: '10px', textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700, fontSize: "0.8rem", color: '#5a6070', borderColor: '#E2E8F0', '&:hover': { background: '#f8fafc', borderColor: '#CBD5E1' } }}
        >Cancel</Button>
        <Button onClick={onConfirm} variant="contained" fullWidth disabled={isLoading}
          sx={{
            height: '40px', borderRadius: '10px', textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700, fontSize: "0.8rem", color: "white",
            background: title.includes('Delete') ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #1776F2, #0d5fcc)',
            boxShadow: title.includes('Delete') ? '0 4px 12px rgba(239,68,68,0.25)' : '0 4px 12px rgba(23,118,242,0.25)',
          }}
        >{confirmText}</Button>
      </Stack>
    </DialogActions>
  </Dialog>
);

/* ── Card Component ──────────────────────────────────────────────────── */
const PositionCard: React.FC<any> = ({ position, onEdit, onDelete, onDuplicate }) => {
  const statusConfig: any = {
    created: { color: '#00D4A8', bg: 'rgba(0,212,168,0.1)', border: 'rgba(0,212,168,0.2)', label: 'CREATED' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'ANALYZING' },
    completed: { color: '#1776F2', bg: 'rgba(23,118,242,0.1)', border: 'rgba(23,118,242,0.2)', label: 'COMPLETED' },
  };
  const config = statusConfig[position.status] || statusConfig.created;

  return (
    <Card className="use-case-card" sx={{
      borderRadius: '16px',
      background: '#ffffff',
      border: '1px solid #e8edf5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      mb: 1.5,
      overflow: 'visible',
      position: 'relative',
    }}>
      {/* Status glow line */}
      <Box sx={{ position: 'absolute', left: 0, top: '10%', bottom: '10%', width: 3, borderRadius: '0 4px 4px 0', background: config.color }} />

      <CardContent sx={{ p: { xs: 2, md: 2.5 }, '&:last-child': { pb: { xs: 2, md: 2.5 } } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} pl={1}>

          <Stack spacing={0.8} flex={1}>
            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" gap={1}>
              <MUILink component={RouterLink} to={`/position/${position.id}`} underline="hover" sx={{
                color: '#1E1E1E', fontFamily: 'Montserrat', fontWeight: 800, fontSize: { xs: '0.9rem', md: '1.05rem' }, letterSpacing: '-0.01em',
              }}>
                {position.title}
              </MUILink>
              <Chip label={config.label} sx={{
                height: 22, color: config.color, background: config.bg, border: `1px solid ${config.border}`,
                fontFamily: 'Montserrat', fontSize: "0.6rem", fontWeight: 800, borderRadius: "6px", letterSpacing: '0.05em'
              }} />
            </Stack>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 500, color: '#5a6070', fontSize: "0.75rem", lineHeight: 1.5, maxWidth: '85%' }}>
              {position.description}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.8} alignItems="center">
            <Tooltip title="Duplicate Position" placement="top" arrow>
              <IconButton onClick={onDuplicate} sx={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', '&:hover': { background: '#e2e8f0', color: '#1E1E1E' } }}>
                <ContentCopyIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Details" placement="top" arrow>
              <IconButton onClick={onEdit} sx={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#64748b', '&:hover': { background: '#e2e8f0', color: '#1E1E1E' } }}>
                <EditIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Permanently" placement="top" arrow>
              <IconButton onClick={onDelete} sx={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', color: '#ef4444', '&:hover': { background: '#fee2e2', color: '#dc2626' } }}>
                <DeleteIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </Tooltip>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
};

/* ── Main Page ───────────────────────────────────────────────────────── */
export default function UseCases() {
  const { positions, getPositions, updatePosition, deletePosition, duplicatePosition, isLoading, pagination } = usePositionsStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);

  const fetchData = async (page = 0, size = 5) => {
    setIsLoadingPage(true); await getPositions(page, size); setIsLoadingPage(false);
  };

  useEffect(() => { injectCasesStyles(); fetchData(0, 5); }, []);

  const handlePageChange = async (newPage: number) => fetchData(newPage, 5);

  const actionHandlers = {
    edit: (pos: any) => { setSelectedPosition(pos); setIsEditModalOpen(true); },
    delete: (pos: any) => { setSelectedPosition(pos); setIsDeleteModalOpen(true); },
    duplicate: (pos: any) => { setSelectedPosition(pos); setIsDuplicateModalOpen(true); },
    save: async (t: string, d: string) => { if (selectedPosition) await updatePosition(selectedPosition.id, { title: t, description: d }); await fetchData(pagination?.pageNumber || 0, 5); },
    confirmDel: async () => { if (selectedPosition) await deletePosition(selectedPosition.id); await fetchData(pagination?.pageNumber || 0, 5); setIsDeleteModalOpen(false); setSelectedPosition(null); },
    confirmDup: async () => { if (selectedPosition) await duplicatePosition(selectedPosition.id); await fetchData(pagination?.pageNumber || 0, 5); setIsDuplicateModalOpen(false); setSelectedPosition(null); },
  };

  if (isLoadingPage) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#fafbfc' }}>
      <CircularProgress sx={{ color: '#1776F2' }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', background: '#fafbfc', position: 'relative', overflow: 'hidden', pb: 8 }}>

      {/* Background Decor */}
      <Box sx={{ position: 'fixed', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(23,118,242,0.03), transparent 70%)', animation: 'float-orb 15s ease-in-out infinite alternate', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,168,0.03), transparent 70%)', animation: 'float-orb 18s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ mt: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>

        {/* Header Section */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, animation: 'fade-up 0.4s ease both' }}>
          <Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: { xs: '1.5rem', md: '1.8rem' }, fontWeight: 800, color: '#1E1E1E', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              Use Cases <SparkleIcon sx={{ color: '#1776F2', fontSize: '1.4rem' }} />
            </Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontSize: '0.82rem', fontWeight: 500, color: '#5a6070', mt: 0.5 }}>
              Manage and organize all your AI candidate evaluation models.
            </Typography>
          </Box>
          <Button
            component={RouterLink} to="/create-position"
            sx={{
              background: 'linear-gradient(135deg, #1776F2 0%, #0d5fcc 50%, #1776F2 100%)', backgroundSize: '200% auto', animation: 'shimmer-bg 4s linear infinite',
              color: 'white', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.8rem', textTransform: 'none', borderRadius: '12px', px: 2.5, py: 1.2, boxShadow: '0 8px 24px rgba(23,118,242,0.25)', flexShrink: 0, '&:hover': { boxShadow: '0 10px 28px rgba(23,118,242,0.35)' }
            }}
          >
            <AddIcon sx={{ fontSize: '1.1rem', mr: 1 }} /> New Use Case
          </Button>
        </Box>

        {/* Empty State vs List */}
        {positions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, borderRadius: '24px', border: '1px dashed #cbd5e1', background: 'rgba(255,255,255,0.6)', textAlign: 'center', animation: 'fade-up 0.5s 0.1s ease both' }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '16px', background: 'linear-gradient(135deg, rgba(23,118,242,0.1), rgba(0,212,168,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FolderIcon sx={{ fontSize: '2rem', color: '#1776F2' }} />
            </Box>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: '1.2rem', color: '#1E1E1E', mb: 1 }}>No Use Cases Yet</Typography>
            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 500, fontSize: '0.85rem', color: '#5a6070', maxWidth: 400, mx: 'auto', mb: 3 }}>
              Create your first Use Case to define criteria for evaluating candidate CVs automatically.
            </Typography>
            <Button component={RouterLink} to="/create-position" variant="contained" sx={{ background: '#1776F2', borderRadius: '10px', textTransform: 'none', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.8rem', px: 3, boxShadow: 'none' }}>
              Create Position
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2} sx={{ mb: 4 }}>
            {positions.map((position, i) => (
              <Box key={position.id} sx={{ animation: `fade-up 0.4s ${0.1 + (i * 0.05)}s ease both` }}>
                <PositionCard
                  position={position}
                  onEdit={() => actionHandlers.edit(position)}
                  onDelete={() => actionHandlers.delete(position)}
                  onDuplicate={() => actionHandlers.duplicate(position)}
                />
              </Box>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {positions.length > 0 && pagination && pagination.totalPages > 1 && (
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2.5} sx={{ mt: 5, animation: 'fade-up 0.4s 0.3s ease both' }}>
            <Button
              disabled={pagination.pageNumber === 0}
              onClick={() => handlePageChange(pagination.pageNumber - 1)}
              sx={{ borderRadius: '99px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', px: 3, py: 0.8, color: '#1776F2', background: 'rgba(23,118,242,0.08)', '&:hover': { background: 'rgba(23,118,242,0.15)' }, '&:disabled': { background: '#f1f5f9', color: '#94a3b8' } }}
            >
              Previous
            </Button>

            <Typography sx={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '0.75rem', color: '#5a6070', px: 1 }}>
              Page {pagination.pageNumber + 1} of {pagination.totalPages}
            </Typography>

            <Button
              disabled={(pagination.pageNumber + 1) >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.pageNumber + 1)}
              sx={{ borderRadius: '99px', fontFamily: 'Montserrat', fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', px: 3, py: 0.8, color: '#1776F2', background: 'rgba(23,118,242,0.08)', '&:hover': { background: 'rgba(23,118,242,0.15)' }, '&:disabled': { background: '#f1f5f9', color: '#94a3b8' } }}
            >
              Next
            </Button>
          </Stack>
        )}
      </Container>

      {/* Modals */}
      <EditPositionModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedPosition(null); }} position={selectedPosition} onSave={actionHandlers.save} isLoading={isLoading} />
      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedPosition(null); }} onConfirm={actionHandlers.confirmDel} title="Delete Use Case?" message="Are you sure you want to delete this position? All associated criteria and candidate rankings will be permanently removed." confirmText="Delete Forever" isLoading={isLoading} />
      <ConfirmModal isOpen={isDuplicateModalOpen} onClose={() => { setIsDuplicateModalOpen(false); setSelectedPosition(null); }} onConfirm={actionHandlers.confirmDup} title="Duplicate Use Case?" message={`This will create an exact copy of "${selectedPosition?.title}" including all its criteria.`} confirmText="Duplicate" isLoading={isLoading} />
    </Box >
  );
}
