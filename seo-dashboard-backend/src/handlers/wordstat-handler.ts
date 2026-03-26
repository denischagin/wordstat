import z from "zod";
import express, { Router, Request } from "express";
import { validateBody } from "@/validation/validate-body-middlware";
import { WordstatService } from "@/services/wordstat-service";
import { asyncHandler, CustomError } from "@/middlware/errors";
import { authMiddleware } from "@/middlware/auth";

const phraseSchema = z.object({
  phrases: z.array(z.string(), { error: '"phrases" must be an array' }),
});

export class WordstatHandler {
  public router: Router = express.Router();
  constructor(private wordstatService: WordstatService) {
    this.router.post(
      "/tasks/",
      authMiddleware,
      validateBody(phraseSchema),
      asyncHandler(async (req: Request<z.infer<typeof phraseSchema>>, res) => {
        const data = await this.wordstatService.processTask(
          req.body.phrases,
          req.yandexId,
        );
        res.json(data);
      }),
    );
    this.router.get(
      "/tasks/",
      authMiddleware,
      asyncHandler(async (req, res) => {
        const data = await this.wordstatService.getUserTasks(req.yandexId);
        res.json(data);
      }),
    );

    this.router.get(
      "/tasks/:taskId/csv",
      authMiddleware,
      asyncHandler(async (req, res) => {
        const taskId = Number(req.params.taskId);
        const yandexId = req.yandexId;
        const csv = await this.wordstatService.getCsv(taskId, yandexId);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');
        res.send(csv);
      }),
    );
    // this.router.get(
    //   "/user/",
    //   authMiddleware,
    //   asyncHandler(async (req, res) => {
    //     const userInfo = await this.wordstatService.getUserInfo(req.yandexId);
    //     res.json(userInfo);
    //   }),
    // );
  }
  // private init() {
  //   this.router.post(
  //     "/wordstat",
  //     validateBody(phraseSchema),
  //     asyncHandler(async (req: Request<z.infer<typeof phraseSchema>>, res) => {
  //       const data = await this.wordstatService.process(
  //         req.body.phrases,
  //         req.body.tokens,
  //       );
  //       res.json(data);
  //     }),
  //   );

  //   this.router.get(
  //     "/wordstat",
  //     asyncHandler(async (req, res) => {
  //       const data = this.wordstatService.getData();
  //       res.json({
  //         csvUrl: `wordstat/csv/`,
  //         status: data.status,
  //       });
  //     }),
  //   );

  //   this.router.get(
  //     "/wordstat/csv",
  //     asyncHandler(async (req, res) => {
  //       const csv: string = this.wordstatService.getCsv();

  //       res.setHeader("Content-Type", "text/csv");
  //       res.setHeader("Content-Disposition", 'attachment; filename="data.csv"');

  //       res.send(csv);
  //     }),
  //   );

  //   this.router.get("/user-info", async (req, res) => {
  //     const token = req.header("Authorization")?.split(" ")[1];

  //     if (!token) throw new CustomError("No token provided", 401);

  //     const userInfo = await this.wordstatService.getUserInfo(token);
  //     res.json(userInfo);
  //   });
  // }
}
