module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jasmine: {
			ministry: {
				src: 'lib/**/*.js',
				options: {
					keepRunner: true,
					version: '1.3.1',
					helpers: 'test/helpers/**/*.js',
					specs: 'test/specs/**/*.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						version: '2.1.5',
						requireConfig: {
							baseUrl: 'lib/'
						}
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
};
