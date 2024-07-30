---
weight: 900
title: "db table columns info"
description: ""
icon: "article"
date: "2024-07-30T14:28:55-05:00"
lastmod: "2024-07-30T14:28:55-05:00"
draft: false
toc: true
---


```sql
SELECT 
    c.table_schema,
    c.table_name,
    c.column_name,
    c.data_type
FROM 
    information_schema.columns c
WHERE 
    c.table_schema NOT IN ('information_schema', 'pg_catalog')
ORDER BY 
    c.table_schema,
    c.table_name,
    c.ordinal_position
```