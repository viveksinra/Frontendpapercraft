'use client';

export const dataSourceHelpContent = {
  pageIntro: {
    title: 'What lives in the Data Source Hub?',
    subtitle: 'All ingestion + QA in one surface.',
    body: [
      'Centralize every dataset that feeds your templated SEO pages, no matter if the source is a CSV, spreadsheet, connector, or AI generated rows.',
      'Lock QA gates, approvals, and sync frequency here so each tenant publishes only compliant, crawl-ready pages at scale.',
    ],
  },
  datasetList: {
    title: 'Datasets',
    tooltip: 'What is a dataset?',
    body: [
      'Each dataset feeds a specific programmatic template or tenant experience. Keep one dataset per intent (locations, services, inventory, etc.) for clean routing.',
      'Selecting a dataset loads its QA gates, sync configuration, and connector history to the right panel.',
    ],
  },
  datasetHeader: {
    title: 'Dataset overview',
    subtitle: 'Explain how this table powers generation.',
    tooltip: 'How is this dataset used?',
    body: [
      'Each dataset is paired with templates to generate thousands of SEO pages. Name + description should make it obvious to future editors what entity or intent it covers.',
      'Use the status + approval badges to spot if publishing is blocked before running bulk generation jobs.',
    ],
  },
  tabs: {
    title: 'What lives in each tab?',
    tooltip: 'Explain the tabs.',
    body: [
      'Overview handles dataset metadata, QA, and inline uploads. Connectors surfaces ingestion integrations. AI Fabric manages synthetic row jobs and Logs keeps an audit trail of sync health.',
      'Switch tabs before publishing to make sure connectors are healthy and AI jobs finished, otherwise template runs stall.',
    ],
  },
  settings: {
    title: 'How to configure a dataset',
    tooltip: 'What do these fields control?',
    body: [
      'Names, descriptions, and slugs map to template placeholders and internal routing, so keep them stable for canonical URLs.',
      'Source + sync settings dictate which connector runs and how QA is enforced. Toggle approval when humans must verify dataset rows before publish.',
    ],
  },
  snapshot: {
    title: 'Operational snapshot',
    tooltip: 'What do these metrics mean?',
    body: [
      'These fields surface sync cadence, row counts, and QA rules so you can tell if the dataset is ready before generation.',
      'Investigate missing syncs or low row counts before launching templates—thin content will hurt crawl budget.',
    ],
  },
  rows: {
    title: 'Moderate dataset rows',
    tooltip: 'Why approve rows?',
    body: [
      'Audit newly ingested rows here before they flow into template generation. Approve only complete records with the fields your template requires.',
      'Reject or edit rows that contain duplicates, policy violations, or missing structured data so downstream pages stay indexable.',
    ],
  },
  csv: {
    title: 'Quick CSV Upload',
    tooltip: 'How should I format CSV?',
    body: [
      'Paste small CSV batches for rapid QA before wiring up a connector. Use header rows that match your template variables exactly.',
      'Keep files under 2k rows for this fast lane—large imports should go through connectors or the API to avoid timeouts.',
    ],
  },
  logs: {
    title: 'Monitor sync health',
    tooltip: 'Why monitor logs?',
    body: [
      'Every connector run is logged with inserted/updated/rejected counts. Use this to prove governance and surface schema drift.',
      'Investigate failures before triggering publishes—otherwise stale data could block index coverage.',
    ],
  },
  connectorsList: {
    title: 'Connected sources',
    tooltip: 'Why add connectors?',
    body: [
      'Connectors keep datasets fresh without manual uploads. Keep at least one automated source per dataset before scaling generation.',
      'Status chips highlight failing syncs so you can repair credentials before crawlable pages drift.',
    ],
  },
  connectorForm: {
    title: 'Add a connector',
    tooltip: 'How do connector settings work?',
    body: [
      'Pick the integration type and pass JSON settings (spreadsheetId, API token, storage bucket, etc.). Credentials stay scoped to the active tenant/company.',
      'After saving, run a sync to validate schema alignment so QA catches missing required fields.',
    ],
  },
  aiGenerate: {
    title: 'AI row generation',
    tooltip: 'How should I prompt AI?',
    body: [
      'Use prompts to describe the entity you need (ex: "cities with service coverage") and define all required fields so generated rows map back to template variables.',
      'Keep batch sizes reasonable (≤25 rows) and run QA on the generated rows before approving them for publish.',
    ],
  },
  aiHistory: {
    title: 'AI job history',
    tooltip: 'Why review AI jobs?',
    body: [
      'Job history shows whether AI completed generation, how many usable rows you received, and when data was last refreshed.',
      'Investigate failed jobs to tune prompts or field definitions—bad data here will block template QA and degrade SEO output quality.',
    ],
  },
};


