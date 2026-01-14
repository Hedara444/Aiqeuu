import {
    Box,
    Container,
    Paper,
    Typography
} from '@mui/material';

const Stepper = ({ step }: { step: number }) => {
    return (
        <Paper sx={{ borderRadius: '14px' , paddingTop:{xs:"12px"  ,  md:"33px"} ,paddingBottom:{ xs:"4px" ,  md:"10px"}  , mb: 2    }}>
            <Container maxWidth="xl" sx={{ position: 'relative', mb: 1.4 }}>
                {/* Progress Line */}
                <Box sx={{
                    position: 'absolute',
                    top: '10px',
                    left: { xs: '36px', md: '64px' },
                    right: { xs: '36px', md: '64px' },
                    height: '3px',
                    backgroundColor: 'grey.300',
                    borderRadius: '1.4px'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, #1776F2, #D1D5DB)',
                        borderRadius: '1.4px'
                    }} />
                </Box>

                {/* Step Circles */}
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Step 1 - Active */}
                    <Box sx={{ 
                        width: { xs: '90px', md: '160px' }, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        transform: 'translateX(-10%)' 
                    }}>
                        <Box sx={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: step >= 1 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.7,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 1 && <Box sx={{
                                width: '11px',
                                height: '11px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '168px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.51rem', md: '0.75rem' },
                                fontWeight: 700,
                                mb: 0.7
                            }}>
                                New Position
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.37rem', md: '0.56rem' },
                                fontWeight: 500
                            }}>
                                Create New Position
                            </Typography>
                        </Box>
                    </Box>

                    {/* Step 2 - Inactive */}
                    <Box sx={{ 
                        width: { xs: '90px', md: '160px' },
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                    }}>
                        <Box sx={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: step >= 2 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.7,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 2 && <Box sx={{
                                width: '11px',
                                height: '11px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '168px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.51rem', md: '0.75rem' },
                                fontWeight: 700,
                                mb: 0.7
                            }}>
                                Upload CV
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.37rem', md: '0.56rem' },
                                fontWeight: 500
                            }}>
                                Download one or more CVs
                            </Typography>
                        </Box>
                    </Box>

                    {/* Step 3 - Inactive */}
                    <Box sx={{ 
                        width: { xs: '90px', md: '160px' },
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        transform: 'translateX(10%)' 
                    }}>
                        <Box sx={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: step >= 3 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 0.7,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 3 && <Box sx={{
                                width: '11px',
                                height: '11px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '168px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.51rem', md: '0.75rem' },
                                fontWeight: 700,
                                mb: 0.7
                            }}>
                                View Result
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.37rem', md: '0.56rem'},
                                fontWeight: 500
                            }}>
                                View Result
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Paper>
    )
};

export default Stepper;
