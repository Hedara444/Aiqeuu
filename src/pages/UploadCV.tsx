import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Navbar } from '@/components/ui/navbar';
import Stepper from '@/components/ui/Stepper';
import { usePositionsStore } from '@/store/positionsStore';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  isComplete: boolean;
}

export default function UploadCV() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const { currentPosition, getPositionById, addResume, deleteResume, startProcessing, isLoading } = usePositionsStore();
  const [uploadedFiles, setUploadedFiles] = useState<Partial<Resume>[]>([...currentPosition.resumes]);

  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const fetchData = async () => {
    setIsLoadingPage(true)
    await getPositionById(id!)
    setIsLoadingPage(false)
  }

  useEffect(() => {
    if (!currentPosition) {
      fetchData()
    }
  }, [])


  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(async (file) => {
      const newFile: Partial<Resume> = {
        id: Date.now().toString() + Math.random(),
        title: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB . uploading`,
        progress: 10,
        isComplete: false
      };

      setUploadedFiles(prev => [...prev, newFile]);

      const resume = await addResume(file, id)

      setUploadedFiles(prev => {
        const index = prev.findIndex(file => file.id === newFile.id);
        if (index === -1) return prev;


        const updatedFiles = [...prev];
        updatedFiles[index] = {
          id: resume.id,
          title: resume.title,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB . uploading`,
          progress: 100,
          isComplete: true
        };

        return updatedFiles;

      });

    });

    // await fetchData()
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDeleteFile = async (id: string) => {
    await deleteResume(id)
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    await fetchData()
  };

  const handleCancel = () => {
    navigate(`/create-criteria/${id}`);
  };

  const handleAnalysis = async () => {
    await startProcessing(id)
    navigate(`/analysis/${id}`);
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
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ px: { xs: 1.5, md: 6 } }}>
        {/* Process Flow Section */}
        <Stepper step={2} />

        {/* Upload Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Paper sx={{ borderRadius: '16px', p: { xs: 4, md: 10 }, boxShadow: 1 }}>
            <Stack spacing={2.5}>
              {/* Upload Area */}
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: isDragOver ? 'primary.main' : 'grey.300',
                  backgroundColor: isDragOver ? 'rgba(0, 235, 189, 0.05)' : 'background.paper',
                  borderRadius: '16px',
                  p: 4,
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClickUpload}
              >
                <Stack alignItems="center" spacing={1.25}>
                  <Box sx={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'grey.200',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CloudUploadIcon sx={{ width: '48px', height: '48px', color: 'text.primary' }} />
                  </Box>
                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        color: 'text.primary',
                        fontFamily: 'Montserrat',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                        transition: 'color 0.3s'
                      }}
                    >
                      Click to upload
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: 'text.primary',
                        fontFamily: 'Montserrat',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        ml: 1
                      }}
                    >
                      or drag and drop
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Uploaded Files List */}
              {uploadedFiles.map((file) => (
                <Paper key={file.id} variant="outlined" sx={{ borderRadius: '16px', p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Box sx={{ minWidth: '56px' }}>
                      <Box
                        component="svg"
                        width="56"
                        height="60"
                        viewBox="0 0 56 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        sx={{ width: '56px', height: '60px' }}
                      >
                        <path d="M15.7411 40.8262H13.9006C13.85 40.8262 13.8065 40.846 13.7699 40.8848C13.7333 40.9244 13.7148 40.9709 13.7148 41.0244V45.7791C13.7148 45.8325 13.7333 45.879 13.7699 45.9187C13.8065 45.9583 13.85 45.9773 13.9006 45.9773H14.4567C14.507 45.9773 14.5504 45.9583 14.5874 45.9187C14.624 45.879 14.6421 45.8325 14.6421 45.7791V44.1376H15.7411C16.2952 44.1376 16.7259 43.9954 17.0327 43.711C17.3391 43.4267 17.4927 43.014 17.4927 42.4745C17.4927 41.9351 17.3391 41.525 17.0327 41.2458C16.7259 40.9658 16.2952 40.8262 15.7411 40.8262ZM16.3318 43.0519C16.1762 43.1622 15.9679 43.2182 15.7069 43.2182H14.6421V41.7456H15.7069C15.9679 41.7456 16.1762 41.799 16.3318 41.9041C16.4874 42.0101 16.5654 42.1997 16.5654 42.4745C16.5654 42.7494 16.4874 42.9416 16.3318 43.0519Z" fill="black" />
                        <path d="M21.632 41.3776C21.4647 41.201 21.2564 41.0649 21.0071 40.9692C20.7574 40.8736 20.4631 40.8262 20.1245 40.8262H18.428C18.3773 40.8262 18.3339 40.846 18.2973 40.8848C18.2607 40.9244 18.2422 40.9709 18.2422 41.0244V45.7791C18.2422 45.8325 18.2607 45.879 18.2973 45.9187C18.3339 45.9583 18.3773 45.9773 18.428 45.9773H20.1587C20.4884 45.9773 20.7755 45.9299 21.0208 45.8342C21.2657 45.7386 21.4708 45.6024 21.6356 45.4258C21.8001 45.2491 21.9272 45.0354 22.0168 44.7856C22.1061 44.5348 22.1596 44.2556 22.1781 43.9463C22.1962 43.5835 22.1962 43.2199 22.1781 42.8571C22.1596 42.5478 22.1061 42.2686 22.0168 42.0179C21.9272 41.768 21.7993 41.5543 21.632 41.3776ZM21.2508 43.9463C21.2416 44.1031 21.213 44.2505 21.1648 44.3875C21.1169 44.5253 21.0469 44.6434 20.9553 44.7407C20.864 44.839 20.7494 44.9165 20.6119 44.9725C20.4747 45.0294 20.3119 45.0578 20.1245 45.0578H19.1695V41.7456H20.0899C20.2869 41.7456 20.4562 41.774 20.5982 41.8309C20.7401 41.8869 20.8579 41.9653 20.952 42.0661C21.0457 42.1669 21.1169 42.2841 21.1648 42.4194C21.213 42.5547 21.2416 42.7003 21.2508 42.8571C21.2689 43.2199 21.2689 43.5835 21.2508 43.9463Z" fill="black" />
                        <path d="M23.8161 40.8262H23.26C23.2093 40.8262 23.1659 40.846 23.1293 40.8848C23.0927 40.9244 23.0742 40.9709 23.0742 41.0244V45.7791C23.0742 45.8325 23.0927 45.879 23.1293 45.9187C23.1659 45.9583 23.2093 45.9773 23.26 45.9773H23.8161C23.8664 45.9773 23.9098 45.9583 23.9468 45.9187C23.9834 45.879 24.0015 45.8325 24.0015 45.7791V41.0244C24.0015 40.9709 23.9834 40.9244 23.9468 40.8848C23.9098 40.846 23.8664 40.8262 23.8161 40.8262Z" fill="black" />
                        <path d="M49.457 16.1441C49.4496 16.1202 49.4437 16.0974 49.4339 16.0746C49.4037 16.0037 49.3657 15.9363 49.3124 15.879L36.3222 1.96122C36.2693 1.90479 36.2072 1.86429 36.1416 1.83219C36.1193 1.8212 36.0968 1.81452 36.0735 1.80634C36.0281 1.79061 35.9824 1.78092 35.9347 1.77682C35.9168 1.7751 35.9007 1.76562 35.8826 1.76562H12.9308C11.11 1.76562 9.62862 3.35283 9.62862 5.30366V36.4264H8.77252C7.52355 36.4264 6.50781 37.5147 6.50781 38.8529V48.2468C6.50781 49.585 7.52355 50.6733 8.77252 50.6733H9.62862V54.7068C9.62862 56.6533 11.11 58.2362 12.9308 58.2362H46.1933C48.014 58.2362 49.4954 56.6533 49.4954 54.7068V16.3512C49.4954 16.3322 49.4868 16.3152 49.4852 16.2964C49.4813 16.2441 49.4721 16.1939 49.457 16.1441ZM36.5031 4.02794L47.3827 15.6851H38.5676C37.4292 15.6851 36.5031 14.6924 36.5031 13.4732V4.02794ZM7.74311 48.2468V38.8529C7.74311 38.2445 8.20474 37.7499 8.77252 37.7499H28.6912C29.3981 37.7499 29.9732 38.366 29.9732 39.1235V47.9763C29.9732 48.7337 29.3981 49.3498 28.6912 49.3498H8.77252C8.20474 49.3498 7.74311 48.8552 7.74311 48.2468ZM46.1932 56.9127H12.9308C11.7912 56.9127 10.8639 55.9235 10.8639 54.7068V50.6733H28.6912C30.0793 50.6733 31.2085 49.4635 31.2085 47.9763V39.1235C31.2085 37.6362 30.0793 36.4264 28.6912 36.4264H10.8639V5.30366C10.8639 4.08267 11.7912 3.08915 12.9308 3.08915H35.2678V13.4732C35.2678 15.4223 36.748 17.0086 38.5676 17.0086H48.2601V54.7068C48.2601 55.9235 47.3328 56.9127 46.1932 56.9127Z" fill="black" />
                        <path d="M40.102 25.0352H19.02C18.679 25.0352 18.4023 25.3316 18.4023 25.6969C18.4023 26.0623 18.679 26.3587 19.02 26.3587H40.102C40.443 26.3587 40.7197 26.0623 40.7197 25.6969C40.7197 25.3316 40.443 25.0352 40.102 25.0352Z" fill="black" />
                        <path d="M19.02 21.2161H29.561C29.902 21.2161 30.1787 20.9197 30.1787 20.5543C30.1787 20.189 29.902 19.8926 29.561 19.8926H19.02C18.679 19.8926 18.4023 20.189 18.4023 20.5543C18.4023 20.9197 18.679 21.2161 19.02 21.2161Z" fill="black" />
                        <path d="M40.102 30.1797H19.02C18.679 30.1797 18.4023 30.4761 18.4023 30.8415C18.4023 31.2068 18.679 31.5032 19.02 31.5032H40.102C40.443 31.5032 40.7197 31.2068 40.7197 30.8415C40.7197 30.4761 40.443 30.1797 40.102 30.1797Z" fill="black" />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography sx={{
                          color: 'text.primary',
                          fontFamily: 'Montserrat',
                          fontSize: '1.25rem',
                          fontWeight: 500
                        }}>
                          {file.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {file.isComplete ? (
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '40px',
                              height: '32px',
                              backgroundColor: 'text.primary',
                              borderRadius: '50%'
                            }}>
                              <CheckCircleIcon sx={{
                                width: '28px',
                                height: '24px',
                                color: 'primary.main'
                              }} />
                            </Box>
                          ) : (
                            <IconButton
                              onClick={() => handleDeleteFile(file.id)}
                              loading={isLoading}
                              disabled={isLoading}
                              sx={{
                                p: 1,
                                '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
                                borderRadius: '8px',
                                transition: 'background-color 0.3s',
                              }}
                            >
                              <DeleteIcon sx={{
                                width: '32px',
                                height: '32px',
                                color: 'text.white',
                                '&:hover': { color: 'error.main' },
                                transition: 'color 0.3s'
                              }} />
                            </IconButton>
                          )}
                          <Typography sx={{
                            color: 'text.primary',
                            fontFamily: 'Montserrat',
                            fontSize: '1.25rem',
                            fontWeight: 500,
                            minWidth: '48px',
                            textAlign: 'right'
                          }}>
                            {file.progress || 100}%
                          </Typography>
                        </Stack>
                      </Stack>

                      <Typography sx={{
                        color: 'text.secondary',
                        fontFamily: 'Montserrat',
                        fontSize: '1rem',
                        mb: 1.5
                      }}>
                        {file.size}
                      </Typography>

                      {/* Progress Bar */}
                      <LinearProgress
                        variant="determinate"
                        value={file.progress}
                        sx={{
                          height: '12px',
                          borderRadius: '6px',
                          backgroundColor: 'grey.300',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: 'primary.main',
                            borderRadius: '6px',
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Container>

        {/* Action Buttons */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{
                px: 4,
                py: 2,
                borderRadius: '26px',
                borderColor: 'grey.400',
                color: 'primary.dark',
                fontFamily: 'Montserrat',
                fontSize: '1.125rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: 'grey.50',
                  borderColor: 'grey.400',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAnalysis}
              variant="contained"
              loading={isLoading}
              disabled={isLoading}
              sx={{
                px: 4,
                py: 2,
                borderRadius: '26px',
                backgroundColor: 'primary.main',
                color: 'white',
                fontFamily: 'Montserrat',
                fontSize: '1.125rem',
                fontWeight: 700,
                textTransform: 'none',
                boxShadow: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 235, 189, 0.9)',
                },
              }}
            >
              analysis
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Footer */}
      <Box component="footer" sx={{ backgroundColor: 'grey.900', py: 10 }}>
        <Container maxWidth="xl" sx={{ px: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <svg
                width="52"
                height="86"
                viewBox="0 0 53 87"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '48px', height: '80px', fill: '#1776F2' }}
              >
                <path
                  d="M34.7183 86.5C34.2121 86.3976 34.0062 86.0288 33.7227 85.7419C26.4361 78.3638 21.2602 69.1269 18.7447 59.012C18.4475 57.5946 17.8379 56.2633 16.9614 55.1175C16.0848 53.9716 14.9639 53.0408 13.6822 52.3944C10.4153 50.571 6.96267 49.0958 3.77671 47.088C-0.610738 44.3563 -0.587117 42.4372 3.81721 39.6918C7.19217 37.5816 10.9046 36.1269 14.2796 34.0372C15.7291 33.326 16.9471 32.2098 17.7895 30.8206C18.1528 29.9007 18.4252 28.9468 18.6029 27.9727C21.2408 17.8517 26.4229 8.59367 33.6451 1.09937C34.4382 0.279853 34.8432 0.320829 35.6127 1.09937C41.0126 6.54917 46.4317 11.9705 51.8699 17.3634C52.582 18.0463 52.7238 18.4697 51.9509 19.2688C51.9509 19.2688 47.8301 25.5381 45.7005 28.6284C44.3974 30.9007 42.5555 32.8089 40.341 34.1806C36.7906 36.1269 33.014 37.6226 29.5412 39.7533C28.1 40.6343 26.2742 41.5358 26.2539 43.3592C26.2337 45.2646 28.1203 46.166 29.6019 47.0675C32.8689 49.0753 36.4025 50.5505 39.8112 52.3124C42.3643 53.8013 44.4653 55.9696 45.8861 58.5817C47.9111 61.6345 52.0555 67.675 52.0555 67.675C52.7035 68.3579 52.6023 68.6994 52.015 69.2935C46.4733 74.7843 40.9721 80.3126 35.4541 85.8239C35.228 86.0698 34.9445 86.2917 34.7183 86.5Z"
                  fill="#1776F2"
                />
              </svg>
              <Typography sx={{
                color: 'primary.main',
                fontFamily: 'Poppins',
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                fontWeight: 700
              }}>
                Aikyuu
              </Typography>
            </Box>

            {/* Copyright */}
            <Typography sx={{
              color: 'grey.300',
              fontFamily: 'Poppins',
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              textAlign: 'center'
            }}>
              Copyright © Resumate. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}