Cloudfront:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "cloudfront:UpdateDistribution",
                "cloudfront:CreateInvalidation"
            ],
            "Resource": [
                "arn:aws:s3:::bucket-name",
                "arn:aws:s3:::bucket-name/*",
                "arn:aws:cloudfront::user-id:distribution/distribution-id"
            ]
        }
    ]
}
```

