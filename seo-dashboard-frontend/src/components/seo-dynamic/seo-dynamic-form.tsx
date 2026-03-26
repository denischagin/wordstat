import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { usePostWordstat } from "@/api/hooks/use-post-wordstat";
import { useGetUserInfo } from "@/api/hooks/use-get-user-info";
import { SeoDynamicCsv } from "@/components/seo-dynamic/seo-dynamic-csv";

interface SeoDynamicFormData {
  words: string;
  tokens: string;
}

const getCountRowsFromText = (text: string) => {
  return text
    .trim()
    .split("\n")
    .filter((phrase) => phrase.trim() !== "");
};

export const SeoDynamicForm: FC = () => {
  const { mutate: sendWordstat } = usePostWordstat();
  const { register, handleSubmit, watch } = useForm<SeoDynamicFormData>({
    defaultValues: {
      words: "",
      tokens: "",
    },
  });

  const words = watch("words");
  // const {
  //   mutate: getUserInfo,
  //   isPending: isPendingUserInfo,
  //   data: userInfo,
  // } = useGetUserInfo();

  const wordsArray = getCountRowsFromText(words);

  const countWords = wordsArray.length;

  const onSubmit = (data: SeoDynamicFormData) => {
    const formData = {
      phrases: data.words.split("\n"),
      tokens: [data.tokens],
    };

    sendWordstat(formData);
  };

  // const handleClickCheckQuota = () => {
  //   getUserInfo(getValues("tokens"));
  // };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Box display="flex" gap={2}>
        <Box flex={1} display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            placeholder={"Фраза для поиска\nДругая фраза\nЕще одна фраза"}
            label="Фразы для поиска"
            multiline
            rows={20}
            {...register("words")}
          />

          <Box>Количество фраз: {countWords}</Box>
        </Box>

        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems={"flex-start"}
        >
          {/* <Box display={"flex"} alignItems={"center"}>
            <Button onClick={handleClickCheckQuota}>Проверить квоту</Button>
            {isPendingUserInfo && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Box>

          <Box minHeight={50}>
            <Typography>
              Лимит в секунду: {userInfo?.userInfo.limitPerSecond ?? "?"}
            </Typography>
            <Typography>
              Дневной лимит: {userInfo?.userInfo.dailyLimit ?? "?"}
            </Typography>
            <Typography>
              Осталось квоты на день:{" "}
              {userInfo?.userInfo.dailyLimitRemaining ?? "?"}
            </Typography>
          </Box> */}

          <Box display={"flex"} mt={5}>
            <Button
              type="submit"
              variant="contained"
              sx={{ alignSelf: "flex-start" }}
            >
              Сгенерировать CSV
            </Button>

            <Typography
              display={"flex"}
              alignItems={"center"}
              color={"textSecondary"}
              sx={{ ml: 1 }}
            >
              * Потратится {countWords} токен(-ов)
            </Typography>
          </Box>
          <SeoDynamicCsv />
        </Box>
      </Box>
    </Box>
  );
};
