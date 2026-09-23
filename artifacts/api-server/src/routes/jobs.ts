import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, jobsTable } from "@workspace/db";
import { GetJobParams, GetJobResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const parsed = GetJobParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, parsed.data.id)).limit(1);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(GetJobResponse.parse(job));
});

export default router;