var gulp        = require('gulp');
var sass        = require('gulp-sass'); //sassのコンパイル
var plumber     = require('gulp-plumber');　//エラーが出たときでも、タスクを止めずに動かす（ファイル監視）
var sourcemaps  = require('gulp-sourcemaps'); //ソースマップを作成
var notify      = require('gulp-notify'); //デスクトップにエラー通知をおこなう
var browserSync = require('browser-sync'); //ローカルサーバを起動

var uglify      = require('gulp-uglify'); //JSの圧縮
var imagemin    = require('gulp-imagemin'); //imgの圧縮

var prettify    = require('gulp-prettify'); //HTMLをきれいに整形
var changed     = require('gulp-changed'); //前回のgulp実行から変更したファイルだけをフィルタリング

var concat      = require('gulp-concat'); //複数のファイルを1つに結合


//HTMLの整形
var htmlDir = {
  src: './src/html/**/*.html',
  dest: './dest/html'
}

gulp.task('html_prettify', function() {
  gulp.src(htmlDir.src)
    .pipe(changed(htmlDir.dest))
    .pipe(prettify({indent_char: ' ', indent_size: 4}))
    .pipe(gulp.dest(htmlDir.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//Sassのコンパイル
var sassDir = {
  src : './src/sass/**/*.scss',
  dest: './dest/css/'
}
gulp.task('sass', function() {
  return gulp.src(sassDir.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(sassDir.dest))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// jsのリロード
gulp.task('js', function() {
  return gulp.src('./src/**/*.js')
    .pipe(browserSync.reload({
      stream: true
    }));
});

//jsの圧縮
gulp.task('jsmin', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dest/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

//画像の圧縮
gulp.task('imagemin', function() {
  return gulp.src('./src/img/**/.png')
    .pipe(imagemin({
      use: {
        pngquant: {
          quality: 60-80,
          speed: 1
        }
      }
    }))
    .pipe(gulp.dest('./dest/img/'))
    gulp.src('./src/img/**/*.jpg')
      .pipe(imagemin())
      .pipe(gulp.dest('./dest/img/'))
    gulp.src('./src/img/**/*.svg')
      .pipe(imagemin())
      .pipe(gulp.dest('./dest/img/'))
    gulp.src('./src/img/**/*.gif')
      .pipe(imagemin())
      .pipe(gulp.dest('./dest/img/'))
});

//browserSyncの設定
gulp.task('browser-sync', function() {
  return browserSync.init(null, {
    port: 8080,
    server: './dest/',
    reloadDelay: 2000
  })
})

//htmlのwatchタスク
gulp.task('html:watch', function() {
  gulp.watch('./src/html/**/*.html', ['html_prettify']);
});

//sassのwatchタスク
gulp.task('sass:watch', function() {
  gulp.watch(sassDir.src, ['sass']);
});

//jsのwatchタスク
gulp.task('js:watch', function() {
  gulp.watch('./src/js/**/*.js', ['jsmin']);
})

gulp.task('w',['html:watch','sass:watch','js:watch','browser-sync']);