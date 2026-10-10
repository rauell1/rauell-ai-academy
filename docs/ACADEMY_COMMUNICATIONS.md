# Academy branding and communications

The shared identity in `src/lib/brand.ts` supplies the Academy name, logo path, colours, tagline, existing Rauell Systems contact address, and public Academy origin. `AcademyLogo` uses this identity; link previews and the browser manifest also identify Rauell AI Academy and use its dedicated logo.

All five existing email notifications now use `src/server/email-template.ts`: password reset, email verification, course enrolment, project review feedback, and issued course completion certificates. The template contains a linked logo and wordmark, clear heading, action button, copyable fallback link, account-specific notice where appropriate, and a footer distinguishing the Academy from its parent ecosystem. A branded plain-text version accompanies the HTML. Dynamic learner/instructor/course content is escaped in HTML.

`APP_ORIGIN` must be the intended environment's HTTP(S) origin without a path, credentials, query, or fragment. Email logos, course actions, certificate verification links, and certificate QR codes use this configured origin rather than the incoming request host. Authentication URLs retain their token and query parameters; the template requires their origin to match the configured Academy origin.

`EMAIL_FROM` accepts a bare mailbox or the documented `Name <mailbox>` format. The configured mailbox must be verified with the existing email provider; its visible display name is always **Rauell AI Academy**. No sender mailbox or credential was provisioned by this change. Existing nonfatal handling of unconfigured email and provider failures remains in place.

The password-reset screen handles failed requests and uses privacy-preserving success wording. It tells learners to look for a Rauell AI Academy email rather than claiming that a request failure sent a message. Email verification remains disabled on signup according to the existing authentication configuration; improving its template does not enable it.

Validation: 58 Vitest tests passed, including branding, link/token preservation, HTML escaping, sender normalization, unsafe-link rejection, suppression, and provider failure behavior. Production build/type checking and lint passed. HTML email rendering and action links were checked in Chromium at 800px and 360px. No real email was sent; provider delivery and email-client-specific rendering remain unverified.
