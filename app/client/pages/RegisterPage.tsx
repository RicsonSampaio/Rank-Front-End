import { Form, Link, useActionData, useNavigation } from "react-router";
import type { action } from "../../routes/register";

export function RegisterPage() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";

  return (
    <main className="rank-login-scene">
      <div className="rank-login-stack">
        <section className="rank-login-card" aria-labelledby="rank-register-title">
          <header className="rank-login-heading">
            <p className="rank-login-eyebrow">The Universe of</p>
            <h1 id="rank-register-title" className="rank-login-title">RANK</h1>
            <p className="rank-login-subtitle"><span>Begin your journey</span></p>
            <p className="rank-login-intro">Create your account and enter the universe of Rank.</p>
          </header>

          <Form method="post" className="rank-login-form">
            <label className="rank-login-label">
              NAME
              <input
                className="rank-login-input"
                type="text"
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={150}
                defaultValue={result?.values.name}
                required
              />
            </label>
            <label className="rank-login-label">
              EMAIL
              <input
                className="rank-login-input"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={320}
                defaultValue={result?.values.email}
                required
              />
            </label>
            <label className="rank-login-label">
              PASSWORD
              <input
                className="rank-login-input"
                type="password"
                name="password"
                autoComplete="new-password"
                required
              />
            </label>
            {result?.error && <p role="alert" className="rank-login-feedback rank-login-feedback-error">{result.error}</p>}
            <button className="rank-login-submit" disabled={submitting} type="submit">
              <span>{submitting ? "Creating account..." : "Create account"}</span>
              {!submitting && <span aria-hidden="true" className="rank-login-arrow">→</span>}
            </button>
          </Form>

          <p className="rank-login-register">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </section>
        <p className="rank-login-footnote" aria-hidden="true">
          <span>CAMPAIGNS</span><b>•</b><span>LORE</span><b>•</b><span>MAPS</span>
        </p>
      </div>
    </main>
  );
}
