import { and, asc, ilike, or, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, communitiesTable, jobsTable, productsTable, rentalsTable, workersTable } from "@workspace/db";
import {
  GetOverviewResponse,
  ListCommunitiesQueryParams,
  ListCommunitiesResponse,
  ListJobsQueryParams,
  ListJobsResponse,
  ListProductsQueryParams,
  ListProductsResponse,
  ListRentalsQueryParams,
  ListRentalsResponse,
  ListWorkersQueryParams,
  ListWorkersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toProduct = (product: typeof productsTable.$inferSelect) => ({
  ...product,
  price: Number(product.price),
  rating: Number(product.rating),
});

const toRental = (rental: typeof rentalsTable.$inferSelect) => ({
  ...rental,
  pricePerDay: Number(rental.pricePerDay),
  rating: Number(rental.rating),
});

const toWorker = (worker: typeof workersTable.$inferSelect) => ({
  ...worker,
  rating: Number(worker.rating),
});

router.get("/overview", async (_req, res): Promise<void> => {
  const [members, jobsPosted, communities, jobs, products, rentals, featuredCommunities] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(workersTable),
    db.select({ count: sql<number>`count(*)` }).from(jobsTable),
    db.select({ count: sql<number>`count(*)` }).from(communitiesTable),
    db.select().from(jobsTable).orderBy(asc(jobsTable.createdAt)).limit(3),
    db.select().from(productsTable).orderBy(asc(productsTable.createdAt)).limit(4),
    db.select().from(rentalsTable).orderBy(asc(rentalsTable.createdAt)).limit(3),
    db.select().from(communitiesTable).orderBy(asc(communitiesTable.createdAt)).limit(3),
  ]);

  res.json(
    GetOverviewResponse.parse({
      stats: {
        activeMembers: Number(members[0]?.count ?? 0),
        jobsPosted: Number(jobsPosted[0]?.count ?? 0),
        communities: Number(communities[0]?.count ?? 0),
        cities: 12,
      },
      featuredJobs: jobs,
      featuredProducts: products.map(toProduct),
      featuredRentals: rentals.map(toRental),
      featuredCommunities,
    }),
  );
});

router.get("/jobs", async (req, res): Promise<void> => {
  const parsed = ListJobsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, location, type, limit } = parsed.data;
  const filters = [
    search ? or(ilike(jobsTable.title, `%${search}%`), ilike(jobsTable.company, `%${search}%`)) : undefined,
    location ? ilike(jobsTable.location, `%${location}%`) : undefined,
    type ? ilike(jobsTable.type, `%${type}%`) : undefined,
  ].filter(Boolean);
  const jobs = await db
    .select()
    .from(jobsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(jobsTable.createdAt))
    .limit(limit);
  res.json(ListJobsResponse.parse(jobs));
});

router.get("/marketplace/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, limit } = parsed.data;
  const filters = [
    search ? or(ilike(productsTable.name, `%${search}%`), ilike(productsTable.seller, `%${search}%`)) : undefined,
    category ? ilike(productsTable.category, `%${category}%`) : undefined,
  ].filter(Boolean);
  const products = await db
    .select()
    .from(productsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(productsTable.createdAt))
    .limit(limit);
  res.json(ListProductsResponse.parse(products.map(toProduct)));
});

router.get("/rentals", async (req, res): Promise<void> => {
  const parsed = ListRentalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, location, limit } = parsed.data;
  const filters = [
    search ? or(ilike(rentalsTable.name, `%${search}%`), ilike(rentalsTable.owner, `%${search}%`)) : undefined,
    location ? ilike(rentalsTable.location, `%${location}%`) : undefined,
  ].filter(Boolean);
  const rentals = await db
    .select()
    .from(rentalsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(rentalsTable.createdAt))
    .limit(limit);
  res.json(ListRentalsResponse.parse(rentals.map(toRental)));
});

router.get("/workers", async (req, res): Promise<void> => {
  const parsed = ListWorkersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, profession, location, limit } = parsed.data;
  const filters = [
    search ? or(ilike(workersTable.name, `%${search}%`), ilike(workersTable.profession, `%${search}%`)) : undefined,
    profession ? ilike(workersTable.profession, `%${profession}%`) : undefined,
    location ? ilike(workersTable.location, `%${location}%`) : undefined,
  ].filter(Boolean);
  const workers = await db
    .select()
    .from(workersTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(asc(workersTable.createdAt))
    .limit(limit);
  res.json(ListWorkersResponse.parse(workers.map(toWorker)));
});

router.get("/communities", async (req, res): Promise<void> => {
  const parsed = ListCommunitiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, limit } = parsed.data;
  const communities = await db
    .select()
    .from(communitiesTable)
    .where(search ? or(ilike(communitiesTable.name, `%${search}%`), ilike(communitiesTable.category, `%${search}%`)) : undefined)
    .orderBy(asc(communitiesTable.createdAt))
    .limit(limit);
  res.json(ListCommunitiesResponse.parse(communities));
});

export default router;