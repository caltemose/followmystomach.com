const gulp = require('gulp')
const path = require('path')
const del = require('del')
const pug = require('gulp-pug')
const autoprefixer = require('gulp-autoprefixer')
const stylus = require('gulp-stylus')
const stylint = require('gulp-stylint')
const browsersync = require('browser-sync').create()
const environments = require('gulp-environments')
const s3 = require('gulp-s3')

const production = environments.production
const develop = environments.develop

const AWS_CREDS = production ? require('./ignore/s3-dev') : require('./ignore/s3-prod')

/* Helper functions
---------------------------------------------------------------- */


/* Supporting tasks
---------------------------------------------------------------- */

gulp.task('clean', (done) => {
    return del('dist', done)
})

gulp.task('html', () => {
    return gulp.src(['src/html/**/*.pug', '!src/html/**/_*.pug'])
        .pipe(pug({
            data: {
                defaultTitle: 'Follow My Stomach',
                separator: '|'
            }
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('css', () => {
    return gulp.src('src/styles/main.styl')
        .pipe(stylus({ 'include css': true }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browsersync.stream())
})

gulp.task('serve', () => {
    browsersync.init({
        server: {
            baseDir: './dist'
        },
        port: 5555,
        notify: false,
        open: false
    })
})

gulp.task('reload', (done) => {
    browsersync.reload()
    done()
})

gulp.task('s3', () => {
    return gulp.src('./dist/**').pipe(s3(AWS_CREDS))
})


/* Watchers
---------------------------------------------------------------- */

gulp.task('watch:html', () => {
    gulp.watch(['src/html/**/*.pug', 'src/templates/**/*.pug'], gulp.series('html', 'reload'))
})

gulp.task('watch:styles', () => {
    gulp.watch('src/styles/**/*', gulp.series('css'))
})

gulp.task('watch', gulp.parallel('watch:html', 'watch:styles'))


/* Linting
---------------------------------------------------------------- */

gulp.task('lint:stylus', () => {
    return gulp.src('src/styles/**/*')
        .pipe(stylint())
        .pipe(stylint.reporter())
})

gulp.task('lint', gulp.series('lint:stylus'))


/* Minification/Production tasks
---------------------------------------------------------------- */


/* Primary tasks used by NPM scripts
---------------------------------------------------------------- */

// build un-minified dist folder
gulp.task('build', gulp.series('clean', gulp.parallel('html', 'css')))

// normal development workflow with server
gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')))

// build then deploy to S3
gulp.task('deploy:dev', () => {
    gulp.series('build', 's3')
})


