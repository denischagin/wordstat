import { useInitAuth } from "@/api/hooks/use-init-auth";
import { LoginForm } from "@/components/login-form/login-form";
import { SeoDynamic } from "@/components/seo-dynamic/seo-dynamic";
import { useAuthStore } from "@/store/auth-store";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const { isLoading } = useInitAuth();
  const accessToken = useAuthStore((s) => s.accessToken);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!accessToken) {
    return <LoginForm />;
  }

  return (
    <Box p={2}>
      <SeoDynamic />
    </Box>
  );
}

export default App;
