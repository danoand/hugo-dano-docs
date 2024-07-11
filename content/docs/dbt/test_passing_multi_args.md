---
weight: 999
title: "dbt test passing multi args"
description: ""
icon: "article"
date: "2024-07-11T16:56:41-05:00"
lastmod: "2024-07-11T16:56:41-05:00"
draft: false
toc: false
---

Example of a dbt test in which multiple columns are passed to the test as an argument

The test itself checks if the set of columns are either all null or all not null (don't want a mix of null and not null)

**Test Code**

```sql
-- tests/generic/test_all_or_none_populated.sql

{% test all_or_none_populated(model, column_name, columns) %}
  with validation as (select 	
		{{ columns | join(', ') }},
		-- testing if all the columns in the set are null
        case when not ({{ columns | join(' IS NULL AND ') }} IS NULL) then 1 else 0 end as failed_all_null,
		-- testing if all the columns in the set are not null
        case when not ({{ columns | join(' IS NOT NULL AND ') }} IS NOT NULL) then 1 else 0 end as failed_all_not_null
	from {{ model }}
    )
    -- test fails if there are rows where both failed_all_null = 1 and failed_all_not_null = 1
    --		(ie. there's a mix of nulls and not nulls)
    select * from validation where failed_all_null = 1 and failed_all_not_null = 1
{% endtest %}
```

Schema definition

```yaml
# models/example/dbt_loan_application_summary.sql

version: 2

models:
  - name: dbt_loan_application_summary
    columns:
      - name: application_id
        data_tests:
          - all_or_none_populated:
              columns: ['bank_name','bank_account_number','bank_account_type','bank_routing_number']
```