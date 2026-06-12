# RenderShot quickstarts — by job

Pick the path that matches what you're trying to do. All examples call the
RapidAPI gateway (`X-RapidAPI-Key` + `X-RapidAPI-Host`); get a key at the
[RapidAPI listing](https://rapidapi.com/eduardoalcantarasp/api/screenshot-e-pdf-render).

| If you want to… | Quickstart |
|---|---|
| Catch visual regressions on every PR | [CI visual regression](ci-visual-regression.md) |
| Screenshot/PDF inside n8n, Make or Zapier | [No-code automation](no-code-automation.md) |
| Capture verifiable, signed evidence of a page | [Evidence / compliance](evidence-compliance.md) |
| Monitor competitors & SERPs, report to clients | [SEO & competitor monitoring](seo-competitor-monitoring.md) |

Endpoints used: `GET/POST /v1/screenshot`, `POST /v1/pdf`, `POST /v1/diff`,
`POST /v1/evidence`, `GET /v1/meta/*`. Full reference: `/openapi.yaml` and `/docs`
on the API host. `diff` and `evidence` require those endpoints to be enabled on
the RapidAPI listing.
