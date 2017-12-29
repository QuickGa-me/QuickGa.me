var gulp = require('gulp');
var s3 = require('gulp-s3-upload')();
var cloudfront = require('gulp-cloudfront-invalidate');


gulp.task('deploy', function () {
    const settings = {
        distribution: 'E34E71D3Q69PBI', // Cloudfront distribution ID
        paths: ['/*'],         // Paths to invalidate
        wait: false                      // Whether to wait until invalidation is completed (default: false)
    };
    return gulp.src(['./css/**/*.css', './index.html', './dist/bundle.js'], {base: './'})
        .pipe(s3({
            Bucket: 'quickga.me',
            ACL: 'public-read'
        }, {
            maxRetries: 5
        }))
        .pipe(cloudfront(settings));
});