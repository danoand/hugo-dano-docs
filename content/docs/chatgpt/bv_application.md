---
weight: 201
title: "bv application"
icon: "article"
date: "2024-07-09T11:30:10-05:00"
lastmod: "2024-07-09T11:30:10-05:00"
draft: false
toc: false
---

```sql
dw_reporting_bsf_origination.application app
and upper(app.asserted) = 'infinity' and upper(app.effective) = 'infinity'
```

