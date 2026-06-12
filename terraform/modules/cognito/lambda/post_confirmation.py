import boto3

client = boto3.client("cognito-idp")

def handler(event, context):
    user_pool_id = event["userPoolId"]
    username = event["userName"]

    client.admin_add_user_to_group(
        UserPoolId=user_pool_id,
        Username=username,
        GroupName="Non-admin",
    )

    return event
