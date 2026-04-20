import React from 'react';
import {Box, Typography} from '@mui/material';

const sansSerifFont = 'Montserrat, Poppins, sans-serif';

const Chapter = ({
    chapterNumber,
    title,
    text,
    showChapter = true,
    showTitle = true,
    showText = true,
}) => {
    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
            }}
        >
            {showChapter && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Box
                        aria-hidden="true"
                        sx={{
                            width: 54,
                            height: 5,
                            backgroundColor: 'sustainable.main',
                            borderRadius: '90px',
                            flexShrink: 0,
                        }}
                    />
                    <Typography
                        variant="overline"
                        sx={{
                            fontFamily: sansSerifFont,
                            color: 'text.primary',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: 1,
                            letterSpacing: 0,
                        }}
                    >
                        CAPITULO {chapterNumber}
                    </Typography>
                </Box>
            )}

            {showTitle && (
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: 'Georgia, "Times New Roman", serif',
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: {xs: '34px', md: '56px'},
                        lineHeight: 1.1,
                        letterSpacing: 0,
                    }}
                >
                    {title}
                </Typography>
            )}

            {showText && (
                <Typography
                    variant="body1"
                    sx={{
                        fontFamily: sansSerifFont,
                        color: 'text.primary',
                        fontSize: {xs: '16px', md: '20px'},
                        lineHeight: 1.6,
                        letterSpacing: 0,
                    }}
                >
                    {text}
                </Typography>
            )}
        </Box>
    );
};

export default Chapter;
