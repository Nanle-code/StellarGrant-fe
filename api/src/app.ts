import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { DataSource } from "typeorm";
import { Grant } from "./entities/Grant";
import { MilestoneProof } from "./entities/MilestoneProof";
import { Contributor } from "./entities/Contributor";
import { AuditLog } from "./entities/AuditLog";
import { Community } from "./entities/Community";
import { Activity } from "./entities/Activity";
import { buildGrantRouter } from "./routes/grants";
import { buildMilestoneProofRouter } from "./routes/milestone-proof";
import { buildSearchRouter } from "./routes/search";
import { buildLeaderboardRouter } from "./routes/leaderboard";
import { buildProfilesRouter } from "./routes/profiles";
import { buildMyDonationsRouter } from "./routes/my-donations";
import { buildCommunitiesRouter } from "./routes/communities";
import { buildNotificationsRouter } from "./routes/notifications";
import { buildAdminRouter } from "./routes/admin";
import { GrantSyncService } from "./services/grant-sync-service";
import { SignatureService } from "./services/signature-service";
import { LeaderboardService } from "./services/leaderboard-service";
import { ResponseCacheService } from "./services/response-cache";
import { RbacService } from "./services/rbac-service";
import { SorobanContractClient } from "./soroban/types";

export const createApp = (dataSource: DataSource, sorobanClient: SorobanContractClient) => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(morgan("tiny"));
  app.use(express.json());

  const grantRepo = dataSource.getRepository(Grant);
  const proofRepo = dataSource.getRepository(MilestoneProof);
  const contributorRepo = dataSource.getRepository(Contributor);
  const auditLogRepo = dataSource.getRepository(AuditLog);
  const communityRepo = dataSource.getRepository(Community);
  const activityRepo = dataSource.getRepository(Activity);

  const grantSyncService = new GrantSyncService(dataSource, sorobanClient);
  const signatureService = new SignatureService();
  const leaderboardService = new LeaderboardService(dataSource);
  const responseCacheService = new ResponseCacheService();
  const rbacService = new RbacService(dataSource);

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/grants", buildGrantRouter(grantRepo, grantSyncService));
  app.use("/milestone_proof", buildMilestoneProofRouter(proofRepo, signatureService));
  app.use("/search", buildSearchRouter(dataSource));
  app.use("/leaderboard", buildLeaderboardRouter(leaderboardService));
  app.use("/profiles/me", buildProfilesRouter(contributorRepo, grantRepo));
  app.use("/my-donations", buildMyDonationsRouter(dataSource));
  app.use("/communities", buildCommunitiesRouter(communityRepo, grantRepo, activityRepo, rbacService));
  app.use("/notifications", buildNotificationsRouter(contributorRepo));
  app.use("/admin", buildAdminRouter(grantSyncService, contributorRepo, auditLogRepo, responseCacheService));

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const message = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  });

  return app;
};
