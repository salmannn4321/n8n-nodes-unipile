# n8n-nodes-unipile-api

An n8n community node for automating LinkedIn outreach and messaging via the Unipile API.

## Features

- ✅ List all connected accounts
- ✅ Get LinkedIn user profile and Provider ID
- ✅ Send LinkedIn connection request with or without a note
- ✅ Send LinkedIn direct message to existing connections
- ✅ Send LinkedIn InMail via Sales Navigator or Recruiter Classic
- ✅ Withdraw a pending connection request
- ✅ Get all LinkedIn conversations

## Requirements

- Unipile account — sign up at [unipile.com](https://unipile.com)
- LinkedIn account connected in Unipile dashboard
- Unipile API Key, DSN, and Account ID

## Installation

In n8n go to:
**Settings → Community Nodes → Install**
Type: `n8n-nodes-unipile-api`

## Credentials Setup

After installing, create a new credential:
- Go to **Credentials → New → Unipile API**
- Enter your **API Key** from Unipile dashboard
- Enter your **DSN** from Unipile dashboard (e.g. `api1.unipile.com:13111`)
- Click **Test** to verify connection

## Operations

### Account
- **List All Accounts** — returns all connected accounts with their IDs

### LinkedIn
- **Get Profile** — fetch full LinkedIn profile and provider_id by username
- **Send Connection Request** — send invite with optional personalized note
- **Send Message** — send direct message to an existing connection
- **Send InMail** — send InMail via Sales Navigator or Recruiter Classic
- **Withdraw Connection Request** — cancel a pending invite by invitation ID
- **Get Conversations** — list all LinkedIn message threads

## Support

For issues or feature requests open a GitHub issue at:
https://github.com/salmannn4321/n8n-nodes-unipile