import { Form, Link, useActionData, useNavigation, useSearchParams } from "react-router";
import type { action } from "../../routes/login";

export function LoginPage() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const submitting = navigation.state === "submitting";

  return (
    <main className="rank-login-scene">
      <div className="rank-login-stack">
        <section className="rank-login-card" aria-labelledby="rank-login-title">
          <header className="rank-login-heading">
            <p className="rank-login-eyebrow">The Universe of</p>
            <h1 id="rank-login-title" className="rank-login-title">RANK</h1>
            <p className="rank-login-subtitle"><span>Welcome to the best universe</span></p>
            <p className="rank-login-intro">Rank&apos;s campaigns, lore, and maps await behind the mist.</p>
          </header>

          {searchParams.get("registered") === "1" && (
            <p role="status" className="rank-login-feedback rank-login-feedback-success">
              Account created successfully. Sign in to continue.
            </p>
          )}

          <Form method="post" className="rank-login-form">
            <label className="rank-login-label">
              EMAIL
              <input
                className="rank-login-input"
                type="email"
                name="email"
                autoComplete="username"
                placeholder="archmage@veilforge.gg"
                required
              />
            </label>
            <label className="rank-login-label">
              PASSWORD
              <input
                className="rank-login-input"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>
            {result?.error && <p role="alert" className="rank-login-feedback rank-login-feedback-error">{result.error}</p>}
            <button className="rank-login-submit" disabled={submitting} type="submit">
              <span>{submitting ? "Entering..." : "Enter Rank"}</span>
              {!submitting && <span aria-hidden="true" className="rank-login-arrow">→</span>}
            </button>
          </Form>

          <p className="rank-login-register">
            New to Rank?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </section>

        <p className="rank-login-footnote" aria-hidden="true">
          <span>CAMPAIGNS</span><b>•</b><span>LORE</span><b>•</b><span>MAPS</span>
        </p>
      </div>
    </main>
  );
}
