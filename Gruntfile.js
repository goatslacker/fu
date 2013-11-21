module.exports = function(grunt) {

  grunt.initConfig({

    uglify: {
      options: {
        /*compress: true,*/
        mangle: true,
        preserveComments: 'some',
        report: 'min'
      },
      compress: {
        src: 'fu.js',
        dest: 'fu.min.js'
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'fu.js', 'test/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    }

  });

  // Load the grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);
};
