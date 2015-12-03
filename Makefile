
build:
	@spm build index.html css/*.*
	@mkdir dist/images
	@spm build images/*.*