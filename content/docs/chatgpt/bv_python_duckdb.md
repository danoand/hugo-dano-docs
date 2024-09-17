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

**Other statements**

```python
# display line number in print statement
print(f"ERROR: line: {inspect.currentframe().f_lineno} - error generating {col} for app_id: {id} see: {err_func}")
```

```sql
-- transform a date to UTC
t.utc_sent_time_min AT TIME ZONE 'UTC'
```