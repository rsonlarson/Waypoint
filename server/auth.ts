import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { storage } from "./storage";

const PgSession = connectPgSimple(session);

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "waypoint-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new PgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  const callbackURL = `https://${process.env.REPLIT_DEPLOYMENT_URL || process.env.REPLIT_DEV_DOMAIN}/api/callback`;

  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: "https://replit.com",
        authorizationURL: "https://replit.com/auth/authorize",
        tokenURL: "https://replit.com/auth/token",
        userInfoURL: "https://replit.com/auth/userinfo",
        clientID: process.env.REPLIT_DEPLOYMENT_ID || "local-dev",
        clientSecret: process.env.REPLIT_DEPLOYMENT_ID || "local-dev",
        callbackURL,
        scope: ["openid", "email", "profile"],
      },
      async (
        issuer: string,
        profile: any,
        done: (err: any, user?: any) => void
      ) => {
        try {
          let user = await storage.getUserByUsername(profile.username || profile.id);
          if (!user) {
            user = await storage.createUser({
              username: profile.username || profile.id,
              email: profile.emails?.[0]?.value || `${profile.username}@replit.com`,
              name: profile.displayName || profile.username || "User",
              school: "Colorado School of Mines",
            });
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.get("/api/login", passport.authenticate("openidconnect"));

  app.get(
    "/api/callback",
    passport.authenticate("openidconnect", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.redirect("/");
    });
  });
}
