import { Box, Typography } from "@mui/material";

export default function VeganSeal() {
    return (
        <Box
            sx={{
                position: "absolute",
                right: "13px",
                bottom: "13px",
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#9FDC26",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-14deg)",
                gap: "2px",
            }}
        >
            <Typography sx={{ fontSize: "8px", fontWeight: 800, color: "#262522", textTransform: "uppercase", letterSpacing: "0.2px", lineHeight: 1 }}>
                VEGAN
            </Typography>
            <Box component="svg" viewBox="0 0 24 24" sx={{ width: 18, height: 18 }}>
                <path d="M12 2C6.5 2 3 7 3 12c0 3.5 2 6.5 5 8 .5-3 2-5.5 4-7.5C14 14 15 16.5 15 20c3-1.5 5-4.5 5-8 0-5-3.5-10-8-10z" fill="#262522" />
            </Box>
            <Typography sx={{ fontSize: "8px", fontWeight: 800, color: "#262522", textTransform: "uppercase", letterSpacing: "0.2px", lineHeight: 1 }}>
                100%
            </Typography>
        </Box>
    );
}
