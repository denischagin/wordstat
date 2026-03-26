import { useGetWordstat } from "@/api/hooks";
import { ENV_SEO_BACKEND_URL } from "@/constants/env";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, Button } from "@mui/material";

export const SeoDynamicCsv = () => {
  const { data } = useGetWordstat();

  return (
    <Box mt={3} display="flex" gap={3}>
      {data?.map(
        (item) =>
          item.status === "COMPLETED" && (
            <Box key={item.id}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                href={ENV_SEO_BACKEND_URL + "tasks/" + item.id + "/csv"}
                component="a"
              >
                Скачать CSV
              </Button>
            </Box>
          ),
      )}
      {/* {data?.status === "pending" && (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">
            Обрабатываем данные...
          </Typography>
        </Box>
      )}
      {data?.csvUrl && (
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          href={ENV_SEO_BACKEND_URL + data.csvUrl}
          component="a"
        >
          {data.status === "success"
            ? "Скачать финальную версию CSV"
            : "Скачать предварительную версию CSV"}
        </Button>
      )} */}
    </Box>
  );
};
