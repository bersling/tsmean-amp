## Error

Long dbhosts (e.g. AWS RDS cluster endpoint) can lead to a `pool name is too long` error.

```
 AttributeError: Pool name 'dbhost_3306_dbname' is too long
```

## Solution

Provide a custom pool name instead of the automatically built one.

```
self.cnx = mysql.connector.connect(
    user=user,
    password=password,
    host=host,
    port=port,
    database=database,
    pool_size=pool_size,
    pool_name="my_custom_pool_name"
)
```

