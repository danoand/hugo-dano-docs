---
weight: 999
title: "bv app ev states"
description: ""
icon: "article"
date: "2024-07-10T08:57:08-05:00"
lastmod: "2024-07-10T08:57:08-05:00"
draft: false
toc: false
---

#### Description

SQL to display the verification states for a specific `application_id`

```sql
select evr.application_id as application_id, evt.ev_type_name as type_name, evst.ev_status_name, lower(evr.effective) as lower_effective,
    evr.effective, evr.asserted, aps.application_status, sst.application_sub_status
from dw_reporting_bsf_origination.ev_result evr
   join dw_reporting_bsf_common.ev_type evt on evr.ev_type_id = evt.ev_type_id
   join dw_reporting_bsf_common.ev_status evst on evr.ev_status_id = evst.ev_status_id
   join dw_reporting_bsf_origination.application app on app.application_id = evr.application_id
        and upper(app.asserted) = 'infinity' and upper(app.effective) = 'infinity'
   left join dw_reporting_bsf_common.application_sub_status sst on app.application_sub_status_id = sst.application_sub_status_id
   left join dw_reporting_bsf_common.application_status aps on sst.application_status_id = aps.application_status_id
where evr.application_id in (2030958) and upper(evr.asserted) = 'infinity' -- and evt.ev_type_name = 'eSign'
order by evr.application_id, lower(evr.effective) asc

```