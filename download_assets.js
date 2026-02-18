import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        const request = https.get(url, options, (response) => {
            // Check for redirect
            if (response.statusCode === 301 || response.statusCode === 302) {
                console.log(`Redirecting to ${response.headers.location}`);
                downloadFile(response.headers.location, dest).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded ${dest}`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err.message);
        });
    });
};

const farmerUrl = "https://images.pexels.com/photos/2165891/pexels-photo-2165891.jpeg";
// Trying a different Pexels video URL just in case, or same one if it works with UA
const tractorUrl = "https://videos.pexels.com/video-files/2883658/2883658-uhd_2560_1440_24fps.mp4";

console.log('Starting downloads...');

Promise.all([
    downloadFile(farmerUrl, path.join(assetsDir, 'farmer.jpg')),
    downloadFile(tractorUrl, path.join(assetsDir, 'tractor.mp4'))
]).then(() => {
    console.log('All downloads finished successfully');
}).catch((err) => {
    console.error('Download failed:', err);
    process.exit(1);
});
