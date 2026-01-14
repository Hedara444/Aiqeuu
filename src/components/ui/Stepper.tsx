import {
    Box,
    Container,
    Paper,
    Typography
} from '@mui/material';

const Stepper = ({ step }: { step: number }) => {
    return (
        <Paper sx={{ borderRadius: '20px' , paddingTop:{xs:"17px"  ,  md:"47px"} ,paddingBottom:{ xs:"10px" ,  md:"25px"}  , mb: 3    }}>
            <Container maxWidth="xl" sx={{ position: 'relative', mb: 2 }}>
                {/* Progress Line */}
                <Box sx={{
                    position: 'absolute',
                    top: '18px',
                    left: '48px',
                    right: '48px',
                    height: '4px',
                    backgroundColor: 'grey.300',
                    borderRadius: '2px'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to right, #1776F2, #D1D5DB)',
                        borderRadius: '2px'
                    }} />
                </Box>

                {/* Step Circles */}
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Step 1 - Active */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: step >= 1 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 1 && <Box sx={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '240px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.725rem', md: '1.075rem' },
                                fontWeight: 700,
                                mb: 1
                            }}>
                                New Position
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.525rem', md: '0.8rem' },
                                fontWeight: 500
                            }}>
                                Create New Position
                            </Typography>
                        </Box>
                    </Box>

                    {/* Step 2 - Inactive */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: step >= 2 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 2 && <Box sx={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '240px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.725rem', md: '1.075rem' },
                                fontWeight: 700,
                                mb: 1
                            }}>
                                Upload CV
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.525rem', md: '0.8rem' },
                                fontWeight: 500
                            }}>
                                Download one or more CVs
                            </Typography>
                        </Box>
                    </Box>

                    {/* Step 3 - Inactive */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: step >= 3 ? "primary.main" : "grey.300",
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {step >= 3 && <Box sx={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'white',
                                borderRadius: '50%'
                            }} />}
                        </Box>
                        <Box sx={{ textAlign: 'center', maxWidth: '240px' }}>
                            <Typography variant="h3" sx={{
                                color: 'primary.dark',
                                fontFamily: 'Montserrat',
                                fontSize: {  xs: '0.725rem', md: '1.075rem' },
                                fontWeight: 700,
                                mb: 1
                            }}>
                                View Result
                            </Typography>
                            <Typography sx={{
                                color: 'text.secondary',
                                fontFamily: 'Montserrat',
                                fontSize: { xs: '0.525rem', md: '0.8rem'},
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
