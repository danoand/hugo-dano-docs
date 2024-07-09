---
weight: 200
title: "bv loan"
icon: "article"
date: "2024-07-09T08:53:17-05:00"
lastmod: "2024-07-09T08:53:17-05:00"
draft: false
toc: false
---

```sql
dw_reporting_bsf_identity.loan l
where upper(l.asserted) = 'infinity' and upper(l.effective) = 'infinity'
```