---
weight: 320
title: "bv settlement"
description: ""
icon: "article"
date: "2024-07-11T10:13:50-05:00"
lastmod: "2024-07-11T10:13:50-05:00"
draft: false
toc: false
---

Common queries to investigate CCBD Settlement variances

```sql
-- Fetch the Loan Level Variances for yesterday (report_date = current_date)
select * from dw_reporting_views.ccbd_loan_level_variances_audit lvl
where lvl.report_date = current_date
```

```sql
-- Fetch the transactions for a specific loan_id
select * from dw_reporting_views.ccbd_transactions_audit cta
where cta.loan_id = 670749
```