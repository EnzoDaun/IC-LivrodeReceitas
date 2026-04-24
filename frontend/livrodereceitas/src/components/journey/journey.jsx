import { useState } from "react";
import { Box, Typography, Button, Stack, Chip } from "@mui/material";
import { journeyFilters } from "../../config/navigation";
import { journeyRecipes } from "../../data/journeyRecipes";
import JourneyCard from "./JourneyCard";

export default function Journey() {
    const [activeFilter, setActiveFilter] = useState("TODAS");

    return (
        <Box sx={{ width: "100%", bgcolor: "transparent", display: "flex", flexDirection: "column", alignItems: "stretch", pt: "51px", pb: "36px" }}>

            {/* ── HEADER ── */}
            <Stack alignItems="center" textAlign="center" width="100%">
                <Chip
                    label="TODAS AS RECEITAS"
                    sx={{
                        bgcolor: "#EE6352",
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.6px",
                        height: 28,
                        borderRadius: "999px",
                        mb: "10px",
                        "& .MuiChip-label": { px: "14px" },
                    }}
                />
                <Typography
                    component="h2"
                    sx={{ fontSize: { xs: "36px", md: "48px" }, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1px", color: "#262522", textTransform: "uppercase", textAlign: "center" }}
                >
                    EMBARQUE EM<br />UMA JORNADA
                </Typography>
                <Typography sx={{ fontSize: "14px", fontWeight: 400, color: "#777570", mt: "10px" }}>
                    Descubra nossa vasta coleção de receitas e ideias
                </Typography>
            </Stack>

            {/* ── FILTROS ── */}
            <Stack direction="row" alignItems="center" justifyContent="center" gap="10px" sx={{ mt: "28px", flexWrap: "wrap", width: "100%" }}>
                {journeyFilters.map((f) => {
                    const isActive = activeFilter === f;
                    return (
                        <Button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            disableElevation
                            disableRipple
                            sx={{
                                height: 36,
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.3px",
                                px: isActive ? "22px" : "18px",
                                minWidth: "unset",
                                whiteSpace: "nowrap",
                                bgcolor: isActive ? "#9FDC26" : "transparent",
                                border: isActive ? "1px solid #262522" : "1px solid #C9C6BE",
                                color: isActive ? "#262522" : "#9A9892",
                                "&:hover": { bgcolor: isActive ? "#8fcc16" : "rgba(0,0,0,0.04)" },
                            }}
                        >
                            {f}
                        </Button>
                    );
                })}
            </Stack>

            {/* ── GRID ── */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px 16px", mt: "32px", width: "100%" }}>
                {journeyRecipes.map((recipe, i) => (
                    <JourneyCard key={i} recipe={recipe} />
                ))}
            </Box>
        </Box>
    );
}
