# Two ways to simulate IAM policies – IAM Policy Simulator / –dryrun

https://awstut.com/en/2023/03/11/two-ways-to-simulate-iam-policies-iam-policy-simulator-dryrun-en/

# Architecture

![dva-02-003-diagram](https://user-images.githubusercontent.com/84276199/224428317-c3ceb83d-41e6-4d1d-8599-9e6d6c07ac81.png)

# Requirements

* AWS CLI
* S3 Bucket(Here, the bucket name is *my-bucket* and region is *ap-northeast-1*)

# Usage

## Tempalte File Modification

Modify the following locations in dva-02-003.yaml.

```yaml
Parameters:
  TemplateBucketName:
    Type: String
    Default: [bucket-name]
```

## Upload  Template Files to S3 Bucket

```bash
aws s3 cp . s3://my-bucket/dva-02-003/ --recursive
```

## CloudFormation Stack Creation

```bash
aws cloudformation create-stack \
--stack-name dva-02-003 \
--template-url https://my-bucket.s3.ap-northeast-1.amazonaws.com/dva-02-003/dva-02-003.yaml \
--capabilities CAPABILITY_IAM
```
