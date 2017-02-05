module.exports = {
	min: {
      files: [{
          expand: true,
          cwd: 'src/tpl/',
          src: ['*.html', '**/*.html'],
          dest: 'release/tpl/',
          ext: '.html',
          extDot: 'first'
      }]
  }
}
