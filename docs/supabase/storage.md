# Storage Quickstart

Learn how to use Supabase to store and serve files.

This guide shows the basic functionality of Supabase Storage. Find a full example application on GitHub.

## Concepts
Supabase Storage consists of **Files**, **Folders**, and **Buckets**.

### Files
Files can be any type of media file, such as images, GIFs, and videos. It is best practice to store files outside of your database because of their sizes. For security, HTML files are returned as plain text.

### Folders
Folders help organize your files, similar to directories on a computer. You can structure them however best fits your project.

### Buckets
Buckets are containers for files and folders, similar to "super folders". They define **Security and Access Rules**. For example, you might keep all video files in a "video" bucket and profile pictures in an "avatar" bucket.

**Naming Guidelines**: File, Folder, and Bucket names must follow AWS object key naming guidelines and avoid special characters.

---

## Creating a Bucket
You can create a bucket using the Supabase Dashboard, SQL, or client libraries.

### Using the Dashboard
1. Navigate to the **Storage** page.
2. Click **New Bucket** and enter a name.
3. Click **Create Bucket**.

### Using JavaScript
```javascript
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
})
```

---

## Uploading a File
Files can be uploaded via the **Dashboard** or client libraries.

### Using JavaScript
```javascript
const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
```

---

## Downloading a File
Files can be downloaded using the **Dashboard** or programmatically.

### Using JavaScript
```javascript
const { data, error } = await supabase.storage.from('bucket_name').download('file_path')
```

---

## Security and Access Rules
Access to files can be restricted using **RLS Policies** via the Dashboard or SQL.

### Using SQL
```sql
create policy "User can delete their own objects"
on storage.objects
for delete
to authenticated
using (
    owner_id = (select auth.uid())
);
```

---

## Bucket Access Models
Buckets can be **public** or **private**.

### Private Buckets
- Require authentication for all operations.
- Best for sensitive documents.
- Access via:
  - Authorization header with JWT.
  - **Signed URLs** (temporary access links).

### Public Buckets
- Allow unrestricted access to stored files.
- Suitable for profile pictures, blog images.

---

## Restricting Uploads
You can restrict file types and sizes within a bucket.

### Example: Restricting to Images under 1MB
```javascript
const { data, error } = await supabase.storage.createBucket('avatars', {
  public: true,
  allowedMimeTypes: ['image/*'],
  fileSizeLimit: '1MB',
})
```

---

## Overwriting Files
Uploading to an existing path returns an error unless **upsert** is enabled.

### Example: Overwriting a File
```javascript
await supabase.storage.from('bucket_name').upload('file_path', file, {
  upsert: true,
})
```

---

## Resumable Uploads
For large files, use the **TUS protocol** for resumable uploads.

### Example: Using `tus-js-client`
```javascript
const tus = require('tus-js-client')
const upload = new tus.Upload(file, {
  endpoint: `https://${projectId}.supabase.co/storage/v1/upload/resumable`,
  metadata: { bucketName: 'bucket', objectName: 'file.png' },
  chunkSize: 6 * 1024 * 1024,
})
upload.start()
```

---

## Copying and Moving Files
Objects can be copied or moved within and across buckets.

### Copying a File
```javascript
await supabase.storage.from('avatars').copy('public/avatar1.png', 'private/avatar2.png')
```

### Moving a File
```javascript
await supabase.storage.from('avatars').move('public/avatar1.png', 'private/avatar2.png')
```

---

## Deleting Files
Files deleted via the API are **permanently removed**.

### Example: Deleting Multiple Files
```javascript
await supabase.storage.from('bucket').remove(['file1.png', 'file2.png'])
```

---

## Image Transformations
Supabase Storage allows **on-the-fly** image resizing and optimization.

### Generating a Resized Image URL
```javascript
supabase.storage.from('bucket').getPublicUrl('image.jpg', {
  transform: { width: 500, height: 600 },
})
```

### Generating a Signed URL for Transformed Image
```javascript
supabase.storage.from('bucket').createSignedUrl('image.jpg', 60000, {
  transform: { width: 200, height: 200 },
})
```

### Supported Formats
| Format | Supported |
|--------|-----------|
| PNG    | ✅        |
| JPEG   | ✅        |
| WebP   | ✅        |
| AVIF   | ✅        |
| GIF    | ✅        |
| SVG    | ✅        |

---

## Scaling and Optimization
### Reduce Egress Costs
- Use **image resizing** to lower file sizes.
- Set **cache-control** headers to leverage browser caching.

### Optimizing RLS Policies
- Add **indexes** to speed up queries.

---

This guide provides an overview of **Supabase Storage** and how to store, retrieve, and manage files efficiently.

Storage Settings
Configure your project's storage settings

Upload file size limit

50

MB

MB
Equivalent to 52 428 800 bytes. Maximum size in bytes of a file that can be uploaded is 50 GB (53,687,091,200 bytes).

Enable Image Transformation


Optimize and resize images on the fly. Learn more.

Free Plan has a fixed upload file size limit of 50 MB.

Upgrade to the Pro Plan for a configurable upload file size limit of up to 50 GB.

Upgrade to Pro

Cancel

Save
S3 Connection
Connect to your bucket using any S3-compatible service via the S3 protocol
Docs
Enable connection via S3 protocol

Allow clients to connect to Supabase Storage via the S3 protocol
Endpoint
https://crklpewpeublfupztbkl.supabase.co/storage/v1/s3

Copy
Region
eu-west-3

Copy

Cancel

Save
S3 Access Keys
Manage your access keys for this project.

New access key
Description	Access key ID	Created at	
video_maker_key	
a0ac9e99bd4faf05816d4e6a2425ca0e

Copy
Today	

Serving assets from Storage

Serving assets from Storage

Public buckets#
As mentioned in the Buckets Fundamentals all files uploaded in a public bucket are publicly accessible and benefit a high CDN cache HIT ratio.

You can access them by using this conventional URL:

https://[project_id].supabase.co/storage/v1/object/public/[bucket]/[asset-name]

You can also use the Supabase SDK getPublicUrl to generate this URL for you

const { data } = supabase.storage.from('bucket').getPublicUrl('filePath.jpg')

console.log(data.publicUrl)

Downloading#
If you want the browser to start an automatic download of the asset instead of trying serving it, you can add the ?download query string parameter.

By default it will use the asset name to save the file on disk. You can optionally pass a custom name to the download parameter as following: ?download=customname.jpg

Private buckets#
Assets stored in a non-public bucket are considered private and are not accessible via a public URL like the public buckets.

You can access them only by:

Signing a time limited URL on the Server, for example with Edge Functions.
with a GET request the URL https://[project_id].supabase.co/storage/v1/object/authenticated/[bucket]/[asset-name] and the user Authorization header
Signing URLs#
You can sign a time-limited URL that you can share to your users by invoking the createSignedUrl method on the SDK.

const { data, error } = await supabase.storage
  .from('bucket')
  .createSignedUrl('private-document.pdf', 3600)

if (data) {
  console.log(data.signedUrl)
}