const gulp = require('gulp')
const path = require('path')
const del = require('del')
const pug = require('gulp-pug')
const autoprefixer = require('gulp-autoprefixer')
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


/* Watchers
---------------------------------------------------------------- */

/* Linting
---------------------------------------------------------------- */

/* Primary tasks used by NPM scripts
---------------------------------------------------------------- */

gulp.task('build', gulp.series('clean', gulp.parallel('html')))

// gulp.task('default', gulp.series('build', gulp.parallel('')))
