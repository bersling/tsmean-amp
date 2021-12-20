## Error

```
NAME                                     READY   STATUS                       RESTARTS   AGE
feature-server-6fd668c967-ps9r4          0/1     CreateContainerConfigError   25         119m
feature-server-75647bc544-nxzpn          0/1     CreateContainerConfigError   0          9m15s
```

## Solution

Probably a missing secret, check all secrets in this section in your yml:

```
secrets:
  key: "feature-server-secrets"
  entries:
    - FEATURE_DB_HOST
    - FEATURE_DB_PORT
    - FEATURE_DB_PASSWORD
    - FEATURE_DB_USER
```

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
