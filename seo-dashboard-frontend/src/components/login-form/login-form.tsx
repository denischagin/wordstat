import { useLogin } from "@/api/hooks";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const LoginForm = () => {
  const [yandexToken, setYandexToken] = useState("");
  const { mutate: login, isPending } = useLogin();

  return (
    <Box display="flex" flexDirection="column" gap={2} maxWidth={400} mx="auto" mt={10}>
      <Typography variant="h6">Авторизация</Typography>
      <TextField
        label="Yandex Token"
        value={yandexToken}
        onChange={(e) => setYandexToken(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        loading={isPending}
        disabled={!yandexToken}
        onClick={() => login({ yandexToken })}
      >
        Войти
      </Button>
    </Box>
  );
};
