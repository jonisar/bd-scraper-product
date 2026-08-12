# Daily validation and alerting

Two scheduled jobs check that what the site publishes actually works:

| Workflow | Runs | Checks |
|---|---|---|
| `daily-flow-validation.yml` | 05:00 UTC | Live pages render, CLI commands and prompts work, docs and API endpoints resolve |
| `daily-api-examples.yml` | 05:30 UTC | Every code example on the Amazon Product Scraper page, executed against the live API: cURL, Python and Node.js, sync and async |

05:00 and 05:30 UTC are 08:00 and 08:30 in Israel, 10:30 and 11:00 IST. To move
them, edit the `cron` line in each workflow. GitHub cron is UTC only and has no
timezone setting, so daylight saving shifts the local time twice a year.

## How the alert reaches your inbox

On failure the job opens an issue and assigns it to `anil-bd`. GitHub emails the
assignee at their account notification address. On the next passing run the job
comments and closes the issue, so an open issue always means currently broken.

A multi-day outage is one issue with daily comments, not one issue per day. The
label, not the title, is the alert's identity.

Both workflows share `.github/actions/alert-issue`.

## One-time setup

1. **Secret.** Add `BRIGHTDATA_API_KEY` under
   Settings → Secrets and variables → Actions. Without it the API example job
   fails on purpose, with a message saying so, rather than reporting a false
   break in the examples.
2. **Email address.** Confirm `anil@brightdata.com` is a verified email on the
   `anil-bd` GitHub account, and that Settings → Notifications has email enabled
   for Participating and mentions. Assignment notifications go to the account
   notification address, not to anything set in this repo.
3. **Default branch.** Scheduled workflows only run from the repository's
   default branch. They do not run from a feature branch or from an open PR.
4. **Forks.** GitHub disables schedules on forked repositories until Actions is
   enabled on the fork, and disables them again after 60 days with no commits.
   If this runs from the fork rather than from `jonisar/bd-scraper-product`,
   check that Actions is enabled there.

The label is created automatically on first failure, so there is nothing to set
up for it.

## Second channel, optional

Issue assignment depends on the job reaching its alert step. For a channel that
survives the alert step itself failing, turn on
GitHub → Settings → Notifications → Actions → email, "failed workflows only".
That notifies the account that owns the cron directly from the runner.

## Testing the alerting without waiting for a break

Run either workflow from the Actions tab with **Run workflow**
(`workflow_dispatch`). To prove the failure path end to end, temporarily point a
snippet at a bad dataset id and dispatch the API examples job: it should fail,
open an assigned issue, and email you. Revert, dispatch again, and the issue
should close itself.
