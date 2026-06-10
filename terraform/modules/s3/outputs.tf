output "asset_bucket_arn" {
  value = aws_s3_bucket.assets.arn
}

output "backup_bucket_arn" {
  value = aws_s3_bucket.backups.arn
}

output "asset_bucket_name" {
  value = aws_s3_bucket.assets.bucket
}

output "backup_bucket_name" {
  value = aws_s3_bucket.backups.bucket
}

output "versioning_enabled" {
  value = var.versioning_enabled
}