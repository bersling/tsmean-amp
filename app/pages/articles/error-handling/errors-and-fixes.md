## Error

```
Unresolved reference: lowercase
```

## Solution

Date: 2022-01-01

`lowercase` is only available since kotlin 1.5, in kotlin 1.4 it's experimental. So either upgrade to 1.5 or add the following to your `build.grade`:

```
tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlin.ExperimentalStdlibApi"]
}
```

## Error

```
NAME                                     READY   STATUS                       RESTARTS   AGE
feature-server-6fd668c967-ps9r4          0/1     CreateContainerConfigError   25         119m
feature-server-75647bc544-nxzpn          0/1     CreateContainerConfigError   0          9m15s
```

## Solution

Date: 2022-01-01

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

Date: 2022-01-01

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

## Error

```
TypeError: Object of type 'ModelMetaclass' is not JSON serializable
```

## Solution

Date: 2022-01-01

Put `response_model` in decorator, not in function definition.

Wrong:

```
@app.post("/users/")
def create_user(user: User, db: Session = Depends(get_db), response_model=User):
db_user_email = crud.get_user_by_email(db, email=user.email)
```

Correct:

```
@app.post("/users/", response_model=User)
def create_user(user: User, db: Session = Depends(get_db)):
db_user_email = crud.get_user_by_email(db, email=user.email)
```