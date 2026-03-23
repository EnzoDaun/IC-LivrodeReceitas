import React, {useState} from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    IconButton,
    Tooltip,
    Rating,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';

const RecipeCard = ({recipe, onView, onToggleFavorite}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
        if (onToggleFavorite) {
            onToggleFavorite(recipe.id, !isFavorite);
        }
    };

    const handleViewClick = () => {
        if (onView) {
            onView(recipe.id);
        }
    };

    const defaultImage = 'https://via.placeholder.com/400x300/F0EBE1/F05E46?text=Receita';

    return (
        <Card
            sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)',
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                },
            }}
        >
            {/* Imagem com botão de favorito */}
            <Box sx={{position: 'relative'}}>
                <CardMedia
                    component="img"
                    height="220"
                    image={imageError ? defaultImage : recipe.imageUrl}
                    alt={recipe.title}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    sx={{
                        width: '100%',
                        height: 220,
                        objectFit: 'cover',
                        display: 'block',
                    }}
                />

                {/* Botão de favoritar */}
                <Tooltip title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
                    <IconButton
                        onClick={handleFavoriteClick}
                        aria-pressed={isFavorite}
                        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        sx={{
                            position: 'absolute',
                            top: 14,
                            right: 14,
                            backgroundColor: 'rgba(255, 255, 255, 0.92)',
                            width: 36,
                            height: 36,
                            border: '1px solid rgba(0,0,0,0.08)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.08)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isFavorite ? (
                            <FavoriteIcon sx={{color: '#F05E46', fontSize: 19}}/>
                        ) : (
                            <FavoriteBorderIcon sx={{color: '#7A7A7A', fontSize: 19}}/>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Conteúdo */}
            <CardContent sx={{pt: 2.5, pb: 1.5, px: 2.5, flexGrow: 1}}>
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 700,
                        fontSize: '17px',
                        mb: 1,
                        color: '#2D2D2D',
                        lineHeight: 1.3,
                    }}
                >
                    {recipe.title}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontSize: '13px',
                        color: '#6B6B6B',
                        lineHeight: 1.55,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {recipe.excerpt}
                </Typography>
            </CardContent>

            {/* Rodapé*/}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2.5,
                    pb: 2.5,
                    gap: 2,
                }}
            >
                {/* Estrelas */}
                <Rating
                    value={recipe.rating}
                    precision={0.5}
                    readOnly
                    size="small"
                    sx={{
                        flexShrink: 0,
                        '& .MuiRating-iconFilled': {
                            color: '#FFB940',
                        },
                        '& .MuiRating-icon': {
                            fontSize: '17px',
                        },
                    }}
                />

                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '10px',
                        letterSpacing: 0.2,
                        color: '#2D2D2D',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {recipe.time} - {recipe.difficulty} - {recipe.portions}
                </Typography>

                {/* Botão */}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleViewClick}
                    aria-label="Ver receita"
                    sx={{
                        borderRadius: '16px',
                        px: 2,
                        py: 0.75,
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        fontSize: '11px',
                        letterSpacing: '0.3px',
                        borderColor: '#2D2D2D',
                        color: '#2D2D2D',
                        backgroundColor: '#FFFFFF',
                        flexShrink: 0,
                        minWidth: 'auto',
                        '&:hover': {
                            borderColor: '#2D2D2D',
                            backgroundColor: 'rgba(45, 45, 45, 0.04)',
                        },
                    }}
                >
                    VER RECEITA
                </Button>
            </Box>
        </Card>
    );
};

export default RecipeCard;

