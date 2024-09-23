---
weight: 999
title: "bv python duckdb"
description: ""
icon: "article"
date: "2024-08-19T16:25:46-05:00"
lastmod: "2024-08-19T16:25:46-05:00"
draft: false
toc: false
---

### Activate a local venv pythyon environment

**In the project folder**

```bash
source .venv/bin/activate
```

```bash
duckdb -cmd ".read research/duckdb/load_duckdb.sql"
```

```bash
python3 df_compare_app_src.py
```

```bash
# regenerate the uat stage tables in the stage environment
stage-table-create
```

**Other statements**

```python
# display line number in print statement
print(f"ERROR: line: {inspect.currentframe().f_lineno} - error generating {col} for app_id: {id} see: {err_func}")
```

```sql
-- transform a date to UTC
t.utc_sent_time_min AT TIME ZONE 'UTC'
```

**Handling Timezone**

Assume you should now just make sure everything is US Central Time 

| table                                             | column                  | value                         | to_char(value)                            | to_char_utc(value)                                           |
|---------------------------------------------------|-------------------------|-------------------------------|-------------------------------------------|--------------------------------------------------------------|
|                                                   |                         |                               | TO_CHAR(<col>, 'YYYY-MM-DD HH24:MI:SSOF') | TO_CHAR(<col> AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SSOF') |
| dw_reporting_bsf_origination.application          | application_created_at  | 2024-09-15 13:03:26.861995-05 | 2024-09-15 13:03:26-05                    | 2024-09-15 18:03:26+00                                       |
| dw_reporting_bsf_dm_balance.preapprovals          | expiration_date         | 2024-07-26                    | 2024-07-26 00:00:00-05                    | 2024-07-26 05:00:00+00                                       |
| dw_reporting_bsf_dm_balance.preapprovals          | expiration_date         | 2024-06-24                    | 2024-06-24 00:00:00-05                    | 2024-06-24 05:00:00+00                                       |
| bitemporal tables                                 | effective               | 2024-09-15 16:02:00.126851-05 | 2024-09-15 16:02:00-05                    | 2024-09-15 21:02:00+00                                       |
| dw_reporting_bsf_leads.lead                       | lead_created_at         | 2018-10-26 06:36:43.663432-05 | 2018-10-26 06:36:43-05                    | 2018-10-26 11:36:43+00                                       |
| dw_reporting_views.silverpop_email_rollup         | sent_time_min / others? | 2024-08-07 11:28:00           | 2024-08-07 11:28:00+00                    | 2024-08-07 06:28:00-05                                       |
| dw_reporting_bsf_email_service.sendgrid_email_log | email_sent_at           | 2020-03-16 11:55:17.763-05    | 2020-03-16 11:55:17-05                    | 2020-03-16 16:55:17+00                                       |