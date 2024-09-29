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
print(f"DEBUG: line: {inspect.currentframe().f_lineno} - app_created_at: {app_created_at} offerwall_created_at: {offerwall_created_at} expired_date: {expiration_date}")
```

```sql
TO_CHAR(app.application_created_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Chicago', 'YYYY-MM-DD HH24:MI:SSOF') as dte_application_created_at,
```

```sql
-- transform a date to UTC
t.utc_sent_time_min AT TIME ZONE 'UTC'
```

```python
expiration_date = expiration_date + timedelta(hours=23, minutes=59)
```
