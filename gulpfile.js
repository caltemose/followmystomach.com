const gulp = require('gulp')
const path = require('path')
const del = require('del')
const pug = require('gulp-pug')
const autoprefixer = require('gulp-autoprefixer')
const stylus = require('gulp-stylus')
const stylint = require('gulp-stylint')
const browsersync = require('browser-sync').create()
const environments = require('gulp-environments')

const production = environments.production
const develop = environments.develop

/* Helper functions
---------------------------------------------------------------- */


/* Supporting tasks
---------------------------------------------------------------- */

gulp.task('clean', (done) => {
    return del('dist', done)
})

gulp.task('html', () => {
    return gulp.src(['src/html/**/*', '!src/html/**/_*.pug'])
        .pipe(pug({}))
        .pipe(gulp.dest('dist'))
})

gulp.task('css', () => {
    return gulp.src('src/styles/main.styl')
        .pipe(stylus({ 'include css': true }))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/styles'))
        .pipe(browsersync.stream())
})

/* Watchers
---------------------------------------------------------------- */

/* Linting
---------------------------------------------------------------- */

gulp.task('lint:stylus', () => {
    return gulp.src('src/styles/**/*')
        .pipe(stylint())
        .pipe(stylint.reporter())
})

gulp.task('lint', gulp.series('lint:stylus'))

/* Primary tasks used by NPM scripts
---------------------------------------------------------------- */

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'css')))

// gulp.task('default', gulp.series('build', gulp.parallel('')))
