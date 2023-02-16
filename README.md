# directus-vue3-bunny-cdn
Extension for directus CMS using vue3 for the bunny.net Image CDN


## Installation
1. Download or fork the repository
2. Install the requirements  ```npm install``` 
3. Copy .env.example to .env and replace variables with yours. (You can follow that documentation)[https://docs.bunny.net/reference/put_-storagezonename-path-filename]. 
    - CDN_API_URL is the url that you need to use for upload the images, composed by: https://<storage entry point>/<storage name>
    - CDN_API_KEY is your storage password
    - CDN_API_GET_URL is your CDN url that is used to read your iamges
    - CDN_API_GET_URL and CDN_API_URL are differents
4. Build the extension ```npm run build```
5. Create a folder in your directus extension/interface folder named **bunny-upload** or an alternate route name.
6. Move the index.js build file to your new folder **directus/extensions/interface/bunny-upload/index.js**
7. Restart directus !
