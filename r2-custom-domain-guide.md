# Serving Cloudflare R2 Assets via Custom Domains and CDN

(Improved Performance and Reduced Costs)

Custom Domains and Cloudflare CDN for R2

Serving your R2 bucket content through a custom domain with
Cloudflare's CDN will cache your images at edge locations worldwide.
This results in faster load times and reduced R2 read requests.

Here’s a summary of the steps:

1. Choose a Custom Domain (or Subdomain)

You can use a subdomain like media.yourdomain.com.

2. Connect Your R2 Bucket to the Custom Domain

In your Cloudflare dashboard, go to R2 -> [Your Bucket] -> Settings ->
Public access, and click Connect Domain. Cloudflare will handle the
DNS configuration for you.

3. Enable Public Access

For the CDN to cache your objects, they must be publicly accessible.
In your R2 bucket settings, under Public access, click Allow Access.
This makes all objects in your bucket publicly readable.

4. Configure Caching

When uploading objects to R2, set the Cache-Control metadata (e.g.,
public, max-age=31536000 for long-lived assets). You can also create
Cache Rules in the Cloudflare dashboard to define more specific
caching policies.

5. Update Your Application

With a public custom domain, you no longer need to generate presigned
URLs. You can construct the image URL directly, which is more
performant and simplifies your code.

For example, your R2Image component could be simplified to:

// Example of R2Image with a public custom domain
`
   export function R2Image({ objectKey, alt, ...props }: R2ImageProps) {
     if (!objectKey) {
       // Handle missing objectKey
       return <div>No Image</div>;
     }
     const src =`https://media.yourdomain.com/${objectKey}`;
return <Image src={src} alt={alt} {...props} />;
}
`

This approach offloads image delivery entirely to Cloudflare's CDN,
providing the best possible performance.
