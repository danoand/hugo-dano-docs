---
weight: 999
title: "bv app_id status"
description: ""
icon: "article"
date: "2024-07-09T16:29:55-05:00"
lastmod: "2024-07-09T16:29:55-05:00"
draft: false
toc: false
---

### Description

Fetch the application status and substatus for a given `application_id`

```sql
select app.application_id, aps.application_status, sst.application_sub_status, l.loan_pro_loan_id 
from dw_reporting_bsf_origination.application app
left join dw_reporting_bsf_common.application_sub_status sst on app.application_sub_status_id = sst.application_sub_status_id
left join dw_reporting_bsf_common.application_status aps on sst.application_status_id = aps.application_status_id
left join dw_reporting_bsf_identity.loan l on l.application_id = app.application_id
    and upper(l.asserted) = 'infinity' and upper(l.effective) = 'infinity'
where upper(app.asserted) = 'infinity' and upper(app.effective) = 'infinity'
    and app.application_id in (2015439)
```

