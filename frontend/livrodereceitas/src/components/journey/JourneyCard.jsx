import { Box, Typography, Button, Card, CardMedia, CardContent, Stack } from "@mui/material";
import VeganSeal from "./VeganSeal";

export default function JourneyCard({ recipe }) {
    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                bgcolor: "#FFFBF2",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ position: "relative", width: "100%", height: 200, flexShrink: 0 }}>
                <CardMedia
                    component="img"
                    image={recipe.image}
                    alt={recipe.title}
                    sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: recipe.objectPosition, display: "block" }}
                />
                {recipe.vegan && <VeganSeal />}
            </Box>

            <CardContent sx={{ p: "18px 20px 16px 20px", display: "flex", flexDirection: "column", flex: 1, "&:last-child": { pb: "16px" } }}>
                <Typography sx={{ fontSize: "20px", fontWeight: 800, color: "#262522", mb: "8px", lineHeight: 1.2 }}>
                    {recipe.title}
                </Typography>

                <Typography sx={{ fontSize: "13px", lineHeight: 1.55, color: "#6B6B6B", fontWeight: 400, flex: 1 }}>
                    {recipe.description}
                </Typography>

                <Stack direction="row" alignItems="flex-end" justifyContent="space-between" sx={{ mt: "14px" }}>
                    <Stack direction="column" gap="4px">
                        <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "#262522", letterSpacing: "0.3px", textTransform: "uppercase" }}>
                            {recipe.meta}
                        </Typography>
                        <Typography sx={{ fontSize: "18px", color: "#FFD233", letterSpacing: "-1px", lineHeight: 1 }}>
                            ★★★★★
                        </Typography>
                    </Stack>

                    <Button
                        variant="outlined"
                        disableElevation
                        disableRipple
                        sx={{
                            height: 34,
                            px: "18px",
                            borderRadius: "999px",
                            border: "1px solid #262522",
                            bgcolor: "transparent",
                            color: "#262522",
                            fontSize: "11px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.3px",
                            minWidth: "unset",
                            "&:hover": { bgcolor: "rgba(38,37,34,0.06)", border: "1px solid #262522" },
                        }}
                    >
                        VER RECEITA
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
